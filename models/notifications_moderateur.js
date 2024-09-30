const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notifications_moderateur', {
    notification_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    type_notification: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    contenu: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date_notification: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    mod_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'moderateurs',
        key: 'mod_id'
      }
    },
    vu: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "non"
    }
  }, {
    sequelize,
    tableName: 'notifications_moderateur',
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
      {
        name: "fk_mod_id_notification",
        using: "BTREE",
        fields: [
          { name: "mod_id" },
        ]
      },
    ]
  });
};
