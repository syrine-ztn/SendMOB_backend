const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('moderateurs', {
    mod_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nom_mod: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    prenom_mod: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    numero_telephone_mod: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status_mod: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "Actif"
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clients',
        key: 'client_id'
      }
    }
  }, {
    sequelize,
    tableName: 'moderateurs',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "mod_id" },
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
