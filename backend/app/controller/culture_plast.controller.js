var db = require('../config/db.config.js');
var Culture_plast = db.culture_plast;

var globalFunctions = require('../config/global.functions.js');
// Получение всех категорий
exports.findAll = (req, res) => {
    Culture_plast.findAll()
        .then(objects => {
            globalFunctions.sendResult(res, objects);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        })
};


