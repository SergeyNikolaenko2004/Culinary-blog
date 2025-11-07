module.exports = (app) => {

    const food_name = require('../controller/food_name.controller');
    
    app.get('/api/food_name', food_name.findAll);

    app.post('/api/addfood', food_name.create);

    app.post('/api/updatefood_name/:id', food_name.update);

    app.get('/api/food_name/culture_plast_id/:culture_plast_id', food_name.findByCulturePlastId);

    app.get('/api/food_name/food/:food', food_name.findByFood);
    
    app.get('/api/food/:id', food_name.findById);
};