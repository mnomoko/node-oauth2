const router = require('express').Router();
const OAuthServer = require('express-oauth-server');
const OAuthModel = require('../config/models');
const sqldb = require('../config/sqldb');
const UserModel = sqldb.User;

let oauth = new OAuthServer({
  model: OAuthModel,
  debug: true,
  accessTokenLifetime: 2 * 60 * 60 // hours * minutes * secondes
});

router.post('/oauth/access_token', oauth.token({
  requireClientAuthentication: {
    authorization_code: false,
    refresh_token: true
  }
}));

router.get('/oauth/authenticate', async (req, res, next) => {
  return res.render('authenticate')
});

router.post('/oauth/authenticate', async (req, res, next) => {
  // req.body.clientId = 'democlient'
  // req.body.state = '1234'
  // req.body.response_type = 'code'
  // // req.body.client_secret = 'democlientsecret'

  req.body.user = await UserModel.findOne({ where: { username: req.body.username } });
  console.log('body : ', req.body.user)

  return next();
}, oauth.authorize({
  authenticateHandler: {
    handle: req => {
      return req.body.user;
    }
  }
}));

module.exports = router;
