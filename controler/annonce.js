var annonce = require("../model/annonce.js");
var user = require("../model/user.js");
var sequelize = require('../db.js');

module.exports.posterAnnonce = function (req, res) {
    if (req.session.id_user) {
        var contenu = req.body.annonce;
        if (contenu.length > 10) {
            annonce.create({
                idUserId: req.session.id_user,
                username: req.session.username,
                contenu: contenu
            }).then(function () {
                if (contenu.length < 10)
                    throw new Error("Vous n'avez pas posté un message assez long.")
                res.redirect('index');
            }).catch(function (error) {
                console.log('Error in Inserting Record', error);
                res.render('error', {
                    title: 'Error',
                    error: "Veuillez rédiger à nouveau une annonce.",
                    error2: "Votre annonce ne comportait pas assez de caractères."
                });
            });
        }
        else
            res.render('error', {
                title: 'Error',
                error: "Veuillez rédiger à nouveau une annonce.",
                error2: "Votre annonce ne comportait pas assez de caractères."
            });
    }
    else {
        res.render('error', {
            title: 'Error',
            error: "Vous n'êtes pas connecté",
            error2: "Veuillez vous connecter."
        });
    }

}

module.exports.getAnnonces = function(req,res) {

    sequelize.query("SELECT * FROM `annonce`", {type: sequelize.QueryTypes.SELECT})
        .then(function(listeAnnonces) {
            res.render("index", {listeAnnonces: listeAnnonces});
        });
}
