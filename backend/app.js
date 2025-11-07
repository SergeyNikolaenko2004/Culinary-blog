var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var db = require('./app/config/db.config.js');
var cors = require('cors');
var corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    optionSuccessStatus: 200 
};
app.use(cors(corsOptions));
var culture_plast = require('./app/route/culture_plast.route.js');
culture_plast(app);
var food_name = require('./app/route/food_name.route.js');
food_name(app);
var user = require('./app/route/user.route.js');
user(app);
var favorite = require('./app/route/favorite.route.js');
favorite(app);

db.sequelize.sync({force: false});

app.listen(3000);