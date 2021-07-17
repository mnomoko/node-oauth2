/** https://github.com/dsquier/oauth2-server-php-mysql **/
var config = require('../db');
var Sequelize = require('sequelize');

var db = {
  sequelize: new Sequelize(
    config.sql.database,
    config.sql.username,
    config.sql.password,
    config.sql
  )
};

db.User = require('./User')(db.sequelize, Sequelize.DataTypes);
db.OAuthClient = require('./OAuthClient')(db.sequelize, Sequelize.DataTypes);
db.OAuthAccessToken = require('./OAuthAccessToken')(db.sequelize, Sequelize.DataTypes);
db.OAuthAuthorizationCode = require('./OAuthAuthorizationCode')(db.sequelize, Sequelize.DataTypes);
db.OAuthRefreshToken = require('./OAuthRefreshToken')(db.sequelize, Sequelize.DataTypes);
db.OAuthScope = require('./OAuthScope')(db.sequelize, Sequelize.DataTypes);

module.exports = db;
