const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transactions', {
    transaction_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    methode_paiement: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    montant_paye: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    date_paiement: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    facture: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    status_transaction: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'plans',
        key: 'plan_id'
      }
    }
  }, {
    sequelize,
    tableName: 'transactions',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "transaction_id" },
        ]
      },
      {
        name: "fk_transactions_plans",
        using: "BTREE",
        fields: [
          { name: "plan_id" },
        ]
      },
    ]
  });
};
