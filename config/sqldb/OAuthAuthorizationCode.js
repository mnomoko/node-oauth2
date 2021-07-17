'use strict';

module.exports = function AuthCodeModel(sequelize, DataTypes) {
  const OAuthAuthorizationCode = sequelize.define('OAuthAuthorizationCode', {
    id: {
      type: DataTypes.INTEGER(14),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    authorization_code : DataTypes.STRING(256),
    expires: DataTypes.DATE,
    redirect_uri: DataTypes.STRING(2000),
    scope: DataTypes.STRING
  }, {
    tableName: 'oauth_authorization_codes',
    timestamps: false,
    underscored: true
  });

  const OAuthClient = require('./OAuthClient')(sequelize, DataTypes);
  const User = require('./User')(sequelize, DataTypes);
  OAuthAuthorizationCode.belongsTo(OAuthClient, { foreignKey: 'client_id', sourceKey: 'id', foreignKeyConstraint: true });
  OAuthAuthorizationCode.belongsTo(User, { foreignKey: 'user_id', sourceKey: 'id', foreignKeyConstraint: true });

  return OAuthAuthorizationCode;
};
