var db = require('../config/db.config.js');
var Favorite = db.favorite;

var globalFunctions = require('../config/global.functions.js');
// Получение всех категорий
exports.findAll = (req, res) => {
    Favorite.findAll()
        .then(objects => {
            globalFunctions.sendResult(res, objects);
        }).catch(err => {
            globalFunctions.sendError(res, err);
        })
};

exports.create = (req, res) => {
    Favorite.create({
        user_id: req.body.user_id,
        food_name_id: req.body.food_name_id
    }).then(object => {
        globalFunctions.sendResult(res, object);
    }).catch(err => {
        globalFunctions.sendError(res, err);
    })
};


exports.delete = (req, res) => {
    Favorite.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        globalFunctions.sendResult(res, 'Запись удалена');
    }).catch(err => {
        globalFunctions.sendError(res, err);
    });
};

exports.findByUserId = (req, res) => {
    Favorite.findAll({
        where: {
            user_id: req.params.user_id
        }
    }).then(objects => {
        globalFunctions.sendResult(res, objects);
    }).catch(err => {
        globalFunctions.sendError(res, err);
    })
};


