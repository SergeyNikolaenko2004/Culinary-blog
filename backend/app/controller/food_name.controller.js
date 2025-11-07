var globalFunctions = require('../config/global.functions.js');

var db = require('../config/db.config.js');
const { Op, where, fn, col } = require('sequelize');
var Food_name = db.food_name;

exports.findAll = (req, res) => {
    Food_name.findAll()
        .then(objects => {
            globalFunctions.sendResult(res, objects);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        })
};

exports.update = (req, res) => {
    Food_name.update({
            description: req.body.description,
            recipe: req.body.recipe
        },
        {
            where: {
                id: req.params.id
            }
        }
    ).then(object => {
        globalFunctions.sendResult(res, object);
    }).catch(err => {
        globalFunctions.sendError(res, err);
    })
};

exports.findByFood = (req, res) => {
    const searchTerm = req.params.food.toLowerCase();
    
    Food_name.findAll({
        where: where(
            fn('LOWER', col('food')),
            Op.like,
            `%${searchTerm}%`
        )
    })
    .then(foods => res.json(foods))
};

exports.findById = (req, res) => {
    Food_name.findAll({
        where: {
            id: req.params.id
        }
    }).then(objects => {
        globalFunctions.sendResult(res, objects);
    }).catch(err => {
        globalFunctions.sendError(res, err);
    })
};
exports.create = (req, res) => {
    Food_name.create({
        food: req.body.food,
        culture_plast_id: req.body.culture_plast_id,
        user_id: req.body.user_id,
        url_image: req.body.url_image,
        description: req.body.description,
        country: req.body.country,
        recipe: req.body.recipe
    
    }).then(object => {
        globalFunctions.sendResult(res, object);
    }).catch(err => {
        globalFunctions.sendError(res, err);
    })
};

exports.findByCulturePlastId = (req, res) => {
    Food_name.findAll({
        where: {
            culture_plast_id: req.params.culture_plast_id
        }
    }).then(objects => {
        globalFunctions.sendResult(res, objects);
    }).catch(err => {
        globalFunctions.sendError(res, err);
    })
};