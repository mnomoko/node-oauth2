'use strict';
var config = require('./../../config')
var sqldb = require('./sqldb');

var OAuthAccessToken = sqldb.OAuthAccessToken
var OAuthAuthorizationCode = sqldb.OAuthAuthorizationCode
var OAuthClient = sqldb.OAuthClient
var OAuthRefreshToken = sqldb.OAuthRefreshToken
var OAuthScope = sqldb.OAuthScope
var User = sqldb.User

const destroy = async () => {
  await User.sync({force:config.seedDBForce});
  await User.destroy({ where: {} });

  await OAuthClient.sync({force: config.seedDBForce})
  await OAuthClient.destroy({where: {}});

  await OAuthAccessToken.sync({force:config.seedDBForce})
  await OAuthAccessToken.destroy({ where: {} });

  await OAuthRefreshToken.sync({force:config.seedDBForce})
  await OAuthRefreshToken.destroy({ where: {} });

  await OAuthAuthorizationCode.sync({force:config.seedDBForce})
  await OAuthAuthorizationCode.destroy({ where: {} });

  await OAuthScope.sync({force:config.seedDBForce})
  await OAuthScope.destroy({ where: {} });
};

const synchronizeDB = async () => {
  return sqldb.sequelize.sync({ force: config.seedDBForce })
    .then(function() {
      bulk()
    })
}

const bulk = async () => {
  await User.bulkCreate([
    { username:'admin',
      password:'a6cb1075ba2b1a151de2b39c8aa1165a9dcd55c021cb8ba67d7a047524224bee', // admin
      scope: 'scp_admin'
    },
    {
      username:'user',
      password:'ed4dd7f1968d7f02b67e35a122efe0cf034205ae7dd381334c3a62260959044b', // user
      scope: 'scp_user'
    }
  ]);
  await OAuthClient.bulkCreate([{
    client_id: 'demoadmin',
    client_secret: 'demoadminsecret',
    redirect_uri: 'http://localhost:3000/oauth/callback',
    grant_types: 'password',
    scope: 'scp_admin',
    user_id: 1
  }, {
    client_id: 'demovtc',
    client_secret: 'demovtcsecret',
    redirect_uri: 'http://localhost:3000/oauth/callback',
    grant_types: 'password',
    scope: 'scp_user',
    user_id: 2
  }]);
  await OAuthScope.bulkCreate([
    {
      scope:'scp_admin',
      is_default: false
    },
    {
      scope:'scp_user',
      is_default: true
    }
  ]);
}

synchronizeDB();
