// db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'mysql',
    database: 'sendmob',
    username: 'root',
    password: '',
});

module.exports = sequelize;
