'use strict';

module.exports = function(sequelize, DataTypes) {
  const OAuthAccessToken = sequelize.define('OAuthAccessToken', {
    id: {
      type: DataTypes.INTEGER(14),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    access_token:DataTypes.STRING(256),
    expires:DataTypes.DATE,
    scope: DataTypes.STRING
  }, {
    tableName: 'oauth_access_tokens',
    timestamps: false,
    underscored: true
  });

  const OAuthClient = require('./OAuthClient')(sequelize, DataTypes);
  const User = require('./User')(sequelize, DataTypes);
  OAuthAccessToken.belongsTo(OAuthClient, { foreignKey: 'client_id', foreignKeyConstraint: true });
  OAuthAccessToken.belongsTo(User, { foreignKey: 'user_id', foreignKeyConstraint: true });

  return OAuthAccessToken;
};
