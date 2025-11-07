module.exports = (app) => {

    const favorite = require('../controller/favorite.controller');
    
    app.get('/api/favorite', favorite.findAll);

    app.post('/api/addfavorite', favorite.create);

    app.post('/api/deletefavorite/:id', favorite.delete);

    app.get('/api/favorite/:user_id', favorite.findByUserId);

};