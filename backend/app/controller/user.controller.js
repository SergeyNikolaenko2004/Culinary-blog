var db = require('../config/db.config.js');
var User = db.user;

var globalFunctions = require('../config/global.functions.js');
// Получение всех категорий
exports.findAll = (req, res) => {
    User.findAll()
        .then(objects => {
            globalFunctions.sendResult(res, objects);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        })

        
};

exports.findById = (req, res) => {
    User.findAll({
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
    User.create({
        username: req.body.username,
        lastname: req.body.lastname,
        password: req.body.password,
        role: req.body.role,
    
    }).then(object => {
        globalFunctions.sendResult(res, object);
    }).catch(err => {
        globalFunctions.sendError(res, err);
    })
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    
    User.findOne({ where: { username } })
      .then(user => {
        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }
        
        // Простое сравнение паролей (в реальном приложении нужно хеширование!)
        if (user.password !== password) {
          return res.status(401).send({ message: "Invalid password" });
        }
        
        res.send({ user });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  };
