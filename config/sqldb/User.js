'use strict';
const crypto = require('crypto');
var env = require('../../env');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User',  {
    id: {
      type: DataTypes.INTEGER(14),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    username: DataTypes.STRING(32),
    password: DataTypes.STRING(255),
    scope: DataTypes.STRING
  }, {
    tableName: 'users', // oauth_users
    timestamps: false,
    underscored: true
  });

  // User.belongsToMany(OAuthClient, { foreignKey: 'client_id', as: 'clients', through: 'user_client' });

  User.prototype.validatePassword = function (password) {
    let _password = crypto.pbkdf2Sync(password, env.salt, 9040,
      32, 'sha512').toString('hex');
    return this.password === _password;
    // return User.prototype.password === _password;
  }


    User.prototype.setPassword = function (password) {
    const hashedPassword = crypto.pbkdf2Sync(password, env.salt, 9040,
      32, 'sha512').toString('hex');
    this.password = hashedPassword;
    // User.prototype.password = hashedPassword;
  }

  return User;
}

