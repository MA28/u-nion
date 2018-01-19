var sequelize = require('../db.js');
const Sequelize = require('sequelize');

const User = sequelize.define('user', {
        nickname: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        rank : Sequelize.INTEGER
    }
    , {
        tableName : 'user',
        createdAt : 'sys_created',
        updatedAt : 'sys_modified',
        deletedAt : false,
        freezeTableName: true
    });

User.sync().then(function(){});

module.exports = User;