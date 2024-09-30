const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('plans', {
    plan_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nom_plan: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    prix: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    duree: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nombre_message: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'plans',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "plan_id" },
        ]
      },
    ]
  });
};
