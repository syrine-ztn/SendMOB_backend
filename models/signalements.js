const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('signalements', {
    signalement_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    objet: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    entete: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date_envoi: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clients',
        key: 'client_id'
      }
    },
    fichiers_joints: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    traite: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "non"
    }
  }, {
    sequelize,
    tableName: 'signalements',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "signalement_id" },
        ]
      },
      {
        name: "client_id",
        using: "BTREE",
        fields: [
          { name: "client_id" },
        ]
      },
    ]
  });
};
