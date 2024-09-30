const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('clients', {
    client_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    corporation_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    corporation_short_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    corporation_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    certificate_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    certificate_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    brn_expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    customer_level: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    legal_form: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tax_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    industry: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sub_industry: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    fax_number: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    customer_grade: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    size_level: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    register_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    register_capital: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    parent_customer: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    customer_language: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    written_language: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    tax_exemption: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "Actif"
    },
    nationality: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    state_province: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    district_region: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    street: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    block: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    house_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    address_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    operation_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    dossier_entreprise: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    stripe_customer_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mod_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'moderateurs',
        key: 'mod_id'
      }
    }
  }, {
    sequelize,
    tableName: 'clients',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "client_id" },
        ]
      },
      {
        name: "fk_mod_id",
        using: "BTREE",
        fields: [
          { name: "mod_id" },
        ]
      },
    ]
  });
};
