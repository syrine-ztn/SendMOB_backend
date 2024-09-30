const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('contact_message_client', {
    contact_message_client_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'messages',
        key: 'sms_id'
      }
    },
    contact_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'contacts',
        key: 'contact_id'
      }
    }
  }, {
    sequelize,
    tableName: 'contact_message_client',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "contact_message_client_id" },
        ]
      },
      {
        name: "message_id",
        using: "BTREE",
        fields: [
          { name: "message_id" },
        ]
      },
      {
        name: "contact_id",
        using: "BTREE",
        fields: [
          { name: "contact_id" },
        ]
      },
    ]
  });
};
