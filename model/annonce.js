var sequelize = require('../db.js');
const Sequelize = require('sequelize');
var User = require('./user.js');
const Annonce = sequelize.define('annonce', {
        contenu: Sequelize.STRING,
        username: Sequelize.STRING
    }
    , {
        tableName : 'annonce',
        createdAt : 'sys_created',
        updatedAt : 'sys_modified',
        deletedAt : false,
        freezeTableName: true
    });
Annonce.belongsTo(User, { as : 'idUser'});
Annonce.sync().then(function(){});

module.exports = Annonce;