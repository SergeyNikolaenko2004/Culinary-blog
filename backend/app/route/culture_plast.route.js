module.exports = (app) => {

    const culture_plast = require('../controller/culture_plast.controller');
    
    // Получение всех категорий
    app.get('/api/culture_plasts', culture_plast.findAll);

};