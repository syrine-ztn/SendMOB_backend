const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notifications_admin', {
    notification_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    type_notification: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    contenu: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date_notification: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    vu: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "non"
    }
  }, {
    sequelize,
    tableName: 'notifications_admin',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "notification_id" },
        ]
      },
    ]
  });
};
