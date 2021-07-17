'use strict';

module.exports = function RefreshTokenModel(sequelize, DataTypes) {
  const RefreshToken = sequelize.define('RefreshToken', {
    id: {
      type: DataTypes.INTEGER(14),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    refresh_token: DataTypes.STRING(256),
    expires: DataTypes.DATE,
    scope: DataTypes.STRING,
  }, {
    tableName: 'oauth_refresh_tokens',
    timestamps: false,
    underscored: true,
  });

  const OAuthClient = require('./OAuthClient')(sequelize, DataTypes);
  const User = require('./User')(sequelize, DataTypes);
  RefreshToken.belongsTo(OAuthClient, { foreignKey: 'client_id', foreignKeyConstraint: true });
  RefreshToken.belongsTo(User, { foreignKey: 'user_id', foreignKeyConstraint: true });

  return RefreshToken;
};
