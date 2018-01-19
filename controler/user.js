var user = require("../model/user.js");
var sequelize = require('../db.js');

module.exports.inscription = function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var nickname = req.body.nickname;
    user.create({
        email: email,
        nickname: nickname,
        password: password,
        rank: 0
    }).then(function () {
        if (email == '' || password == '')
            throw new Error('Veuillez renseigner les informations');
        res.redirect('../../index');

    }).catch(function (error) {
        console.log('Error in Inserting Record', error);
        res.render('error', {
            title: 'error',
            error: "Veuillez renseigner les informations d'inscriptions",
            error2: "Retournez vous inscrire pour saisir une bonne fois pour toute des identifiants corrects !"
        });
    });
}