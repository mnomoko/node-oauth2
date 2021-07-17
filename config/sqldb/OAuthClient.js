'use strict';

module.exports = function AppModel(sequelize, DataTypes) {
  const OAuthClient = sequelize.define('OAuthClient', {
    id: {
      type: DataTypes.INTEGER(14),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: DataTypes.STRING(255),
    client_id: DataTypes.STRING(80),
    client_secret: DataTypes.STRING(80),
    redirect_uri: DataTypes.STRING(2000),
    grant_types: DataTypes.STRING(80),
    scope: DataTypes.STRING(80)
  }, {
    tableName: 'oauth_clients',
    timestamps: false,
    underscored: true
  });

  const User = require('./User')(sequelize, DataTypes);
  OAuthClient.belongsTo(User, { foreignKey: 'user_id', foreignKeyConstraint: true });
  // OAuthClient.belongsToMany(User, { foreignKey: 'user_id', as: 'users', through: 'user_client' });

  return OAuthClient;
};
