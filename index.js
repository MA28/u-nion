var express = require('express');
const path = require('path');
var morgan = require('morgan'); // Charge le middleware de logging
var logger = require('log4js').getLogger('Server');
var bodyParser = require('body-parser');
var app = express();

// config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined')); // Active le middleware de logging
app.use(express.static(__dirname + '/public')); // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)
logger.info('server start');

// Variables pour controler
var userControler = require("./controler/user.js");

app.get('/', function(req, res){
    res.render('pages/index')
});
app.get('/index', function(req, res){
    res.render('pages/index')
});
app.get('/register', function(req, res){
    res.render('pages/register')
});

app.post('/pages/register/check', userControler.inscription);

app.listen(process.env.PORT||1313);