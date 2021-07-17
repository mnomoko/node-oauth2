const router = require('express').Router();
const crypto = require('crypto');
const OAuthModel = require('../config/models');
const sqldb = require('../config/sqldb');
const UserModel = sqldb.User;
const OAuthClientModel = sqldb.OAuthClient;

const scp_user = 'scp_user';

router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Node Express Example'
  });
});

router.get('/register', (req, res, next) => {
  res.render('register', { message: req.flash('message') });
});

router.post('/register', async (req, res, next) => {
  if (req.body.password !== req.body.confirmPassword) {
    return res.send('Passwords does not match', 422);
  }

  const userByUsername = await UserModel.findOne({where: {username: req.body.username}})
    .catch(function(err) {
      console.log('Error post register : ', err)
      return res.send('Error checking if username already exist', 422);
    });
  if (userByUsername != null) {
    return res.send('Username already exist', 422);
  }


  // let transaction;
  // try {
  //   // get transaction
  //   transaction = await sqldb.sequelize.transaction();
  //
  //   // step 1
  //   await Model.destroy({ where: {id}, transaction });
  //
  //   // step 2
  //   await Model.create({}, { transaction });
  //
  //   // step 3
  //   await Model.update({}, { where: { id }, transaction });
  //
  //   // commit
  //   await transaction.commit();
  //
  // } catch (err) {
  //   // Rollback transaction only if the transaction object is defined
  //   if (transaction) await transaction.rollback();
  // }

  // Create User
  let _user = UserModel.build({
    username: req.body.username,
    scope: scp_user
  });
  _user.setPassword(req.body.password);
  let user = null;
  try {
    user = await _user.save();
  } catch (error) {
    console.log(error)
    return res.send(error.msg, 422);
  }

  if (!user) {
    return res.send('Error creating user', 422);
  }

  // Create OAuth Client
  let _client = await OAuthModel.getClient(
    req.body.clientId,
    req.body.clientSecret
  );

  if (!_client) {
    _client = OAuthClientModel.build({
      name: null,
      user_id: user.id,
      client_id: req.body.clientId,
      client_secret: req.body.clientSecret,
      redirect_uri: req.body.redirectUri,
      grant_types: 'password',
      scope: scp_user
      // grants: ['authorization_code', 'client_credentials', 'refresh_token', 'password']
    });
    await _client.save();
  }

  req.flash('message', 'Registration successful!');

  return res.redirect('/register');
});

module.exports = router;
