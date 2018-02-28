var user = require("../model/user.js");
var sequelize = require('../db.js');
var encrypt = require('../encrypt.js');

function isIdUnique(email, username) {
    return user.count({where: {$or: [{email: email}, {username: username}]}})
        .then(function (count) {
            if (count != 0) {
                return false;
            }
            return true;
        });
}

function isEmailAndUsernameUniques(email, username) {
    return user.count({where: [{email: email}, {username: username}]})
        .then(function (count) {
            if (count != 0) {
                return false;
            }
            return true;
        });
}


function isUsernameUnique(username) {
    return user.count({where: {username: username}})
        .then(function (count) {
            if (count != 0) {
                return false;
            }
            return true;
        });
}

function isEmailUnique(email) {
    return user.count({where: {email: email}})
        .then(function (count) {
            if (count != 0) {
                return false;
            }
            return true;
        });
}

module.exports.inscription = function (req, res) {
    if (req.session.username == null) {
        var email = req.body.email;
        var password = req.body.password;
        var username = req.body.username;
        if (req.body.email == 'yacine.tebboune@etu.unice.fr')
            var rank = 1;
        else
            var rank = 0;


        isIdUnique(email, username).then(function (isUnique) {
            if (isUnique) {
                user.create({
                    username: username,
                    email: email,
                    password: password,
                    rank: rank
                }).then(function (user) {
                    if (email == '' || password == '' || username == '')
                        throw new Error('Veuillez renseigner les informations');
                    console.log('Data successfully inserted', user);
                    res.redirect('index');
                }).catch(function (error) {
                    console.log('Error in Inserting Record', error);
                    res.render('error', {
                        title: 'error',
                        error: "Veuillez renseigner les informations d'inscriptions",
                        error2: "Retournez vous inscrire pour saisir une bonne fois pour toute des identifiants corrects !"
                    });
                });
            }
            else
                res.render('error', {
                    title: 'error',
                    error: "Utilisateur déjà existant",
                    error2: "Retournez vous inscrire pour saisir une bonne fois pour toute des identifiants corrects !"
                });
        })
    }
    else {
        res.render('index');
    }
};

module.exports.login = function (req, res) {
    var username = req.body.username;
    var password = encrypt(req.body.password);
    if(req.session.username == null) {
        user.findOne({
            where: {
                username: username,
                password: password
            }
        }).then(function (user) {
            if (!user) {
                res.render('error', {
                    title: 'error',
                    error: 'Mauvais login/mdp',
                    error2: "Reconnectez vous et saisissez une bonne fois pour toute des identifiants corrects !"
                });
            } else {
                console.log('', user);
                req.session.rank = user.dataValues.rank;
                req.session.username = user.dataValues.username;
                req.session.email = user.dataValues.email;
                req.session.id_user = user.dataValues.id;
                res.redirect('index');

            }
        }).catch(function (error) {
            res.render('error', {
                title: 'error',
                error: 'Mauvais login/mdp',
                error2: "Reconnectez vous et saisissez une bonne fois pour toute des identifiants corrects !"
            });
        });
    }
    else {
        res.render('index');
    }
};

module.exports.disconnect = function(req, res){
    delete req.session.username;
    delete req.session.rank;
    delete req.session.id_user;
    res.redirect('index');
}

module.exports.getProfil = function(req, res){
    if (req.session.username != null) {
        user.findOne({
            where: {
                id: req.session.id_user
            }
        }).then(function (user) {
            var nom = user.dataValues.username;
            var email = user.dataValues.email;

            console.log(req.session.id);

            res.render('myaccount', {
                    nom: nom,
                    email: email
                }
            );
        });
    } else
        res.render('error', {
            title: 'error',
            error: "Vous n'êtes pas connecté",
            error2: "dommage"
        });
};

module.exports.editProfil = function (req, res) {
    var email = req.body.emailUser;
    var username = req.body.nomUser;
    var oldMdp = req.body.ancienMdp;
    var newMdp = req.body.newMdp;

    if ((req.body.newMdp == '' || req.body.newMdp == oldMdp) && req.body.emailUser == req.session.email && req.body.nomUser == req.session.username){
        res.render('error', {
            title: 'error',
            error: "Vous n'avez rien changé",
            error2: "Veuillez modifier un élément du profil"
        });
        return;
    }

    if (req.body.ancienMdp == '') {
        res.render('error', {
            title: 'error',
            error: "Vous n'avez pas renseigné votre ancien mot de passe",
            error2: "dommage"
        });
        return;
    }

    console.log(newMdp);
    isIdUnique(email, username).then(function (isUnique) { // CAS : LES 2 SONT UNIQUES
        if (isUnique) {
            if (req.body.newMdp == ''){
                newMdp = oldMdp;
            }
            user.update({
                    username: req.body.nomUser,
                    email: req.body.emailUser,
                    password: newMdp
                },
                {
                    where: {
                        id: req.session.id_user,
                        password: encrypt(req.body.ancienMdp)
                    }
                })
                .then(function (user) {
                    req.session.username = req.body.nomUser;
                    req.session.email = req.body.emailUser;
                    res.redirect('/index');
                }).catch(function (error) {
                res.render('error', {
                    title: 'error',
                    error: "Vous n'êtes pas connecté",
                    error2: "dommage"
                });
            })
        }
        else if (req.body.nomUser == req.session.username && req.body.emailUser == req.session.email && req.body.newMdp != '' ){
            if (req.body.newMdp == ''){
                newMdp = oldMdp;
            }
            user.update({
                    password: req.body.newMdp
                },
                {
                    where: {
                        id: req.session.id_user,
                        password: encrypt(req.body.ancienMdp)
                    }
                })
                .then(function (user) {
                    res.redirect('/index');
                }).catch(function (error) {
                res.render('error', {
                    title: 'error',
                    error: "Vous n'êtes pas connecté",
                    error2: "dommage"
                });
            });
        }
        else if (req.body.emailUser == req.session.email) { // CAS : L'USER NE CHANGE PAS SON EMAIL
            if (req.body.newMdp == ''){
                newMdp = oldMdp;
            }
            isUsernameUnique(username).then(function (isUsernameUnique) {
                if (isUsernameUnique) {
                    user.update({
                            username: req.body.nomUser,
                            password: newMdp
                        },
                        {
                            where: {
                                id: req.session.id_user,
                                password: encrypt(req.body.ancienMdp)
                            }
                        })
                        .then(function (user) {
                            req.session.username = req.body.nomUser;
                            res.redirect('/index');
                        }).catch(function (error) {
                        res.render('error', {
                            title: 'error',
                            error: "Vous n'êtes pas connecté",
                            error2: "dommage"
                        });
                    })
                }
                else {
                    res.render('error', {
                        title: 'error',
                        error: "L'Username que vous avez décidé de choisir est déjà pris",
                        error2: "Veuillez en choisir un nouveau"
                    });
                }
            })
        }
        else if (req.body.nomUser == req.session.username) { // CAS : L'USER NE CHANGE PAS SON USERNAME
            if (req.body.newMdp == ''){
                newMdp = oldMdp;
            }
            isEmailUnique(email).then(function (isEmailUnique) {
                    if (isEmailUnique) {
                        user.update({
                                email: req.body.emailUser,
                                password: newMdp
                            },
                            {
                                where: {
                                    id: req.session.id_user,
                                    password: encrypt(req.body.ancienMdp)
                                }
                            })
                            .then(function (user) {
                                req.session.email = req.body.emailUser;
                                res.redirect('/index');
                            }).catch(function (error) {
                            res.render('error', {
                                title: 'error',
                                error: "Vous n'êtes pas connecté",
                                error2: "dommage"
                            });
                        })
                    }

                    else {
                        res.render('error', {
                            title: 'error',
                            error: "L'Email que vous avez décidé de choisir est déjà pris",
                            error2: "Veuillez en choisir un nouveau"
                        });
                    }

                }
            )
        }

        else {
            res.render('error', {
                title: 'error',
                error: "Vous n'avez rien changé",
                error2: "Veuillez modifier un élément du profil"
            });
        }
    });
}