const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    database: 'u-nion',
    username: 'root',
    password: ''
});

module.exports = sequelize;