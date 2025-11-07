module.exports = (sequelize, Sequelize) => {
    var User = sequelize.define(
        'user',
        {
            id: {
                type: Sequelize.INTEGER(11), 
                autoIncrement: true,
                primaryKey: true 
            },
            username: {
                type: Sequelize.STRING(50),
                allowNull: false 
            },
            lastname: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            password: {
                type: Sequelize.STRING(150),
                allowNull: false
            },
            role: {
                type: Sequelize.ENUM,
                values: ['администратор', 'пользователь'],
                allowNull: false
            }
        });


        User.associate = (models) => {
            User.hasMany(models.food_name, {
                foreignKey: 'user_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                sourceKey: 'id'
            });
        };

    return User;
};