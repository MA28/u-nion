var express = require('express');
const path = require('path');
var morgan = require('morgan'); // Charge le middleware de logging
var logger = require('log4js').getLogger('Server');
var bodyParser = require('body-parser');
var session = require('express-session');
var helmet = require('helmet');
var app = express();

// config
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined')); // Active le middleware de logging
app.use(express.static(__dirname + '/public')); // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)

app.use(session({
    secret: 'keyboard cat',
    cookie: {}
}));
app.use(helmet());
app.disable('x-powered-by');

app.use(function (req, res, next) {
    res.locals._id = req.session.id_user;
    res.locals._rank = req.session.rank;
    res.locals._username = req.session.username;
    res.locals._email = req.session.email;

    next();
});

logger.info('server start');

// Variables pour controler
var userControler = require("./controler/user.js");
var annonceControler = require('./controler/annonce.js');

app.get('/', function(req, res){
    res.redirect('index');
});
app.get('/index', annonceControler.getAnnonces);

app.get('/register', function(req, res){
    if(!req.session.id_user)
        res.render('register');
    else
        res.redirect('index');
});

app.get('/annonce', function(req, res){
    res.render('annonce');
});

app.get('/login', function(req, res){
    if (!req.session.id_user)
        res.render('login');
    else
        res.redirect('index');
});
app.get('/myaccount', userControler.getProfil);
app.post('/myaccount', userControler.editProfil);
app.get('/disconnect', userControler.disconnect);
app.post('/checkRegister', userControler.inscription);
app.post('/checkLogin', userControler.login);

app.post('/posterAnnonce', annonceControler.posterAnnonce);
app.listen(process.env.PORT||1314);