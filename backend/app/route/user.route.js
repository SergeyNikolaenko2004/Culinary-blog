module.exports = (app) => {
    const user = require('../controller/user.controller');

    // Получение всех пользователей
    app.get('/api/user', user.findAll);

    // Получение пользователя по ID
    app.get('/api/user/:id', user.findById);
    
    app.post('/api/adduser', user.create);

    app.post('/api/user/login', user.login);
};