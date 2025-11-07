module.exports = (sequelize, Sequelize) => {
    var Food_name = sequelize.define(
        'food_name',
        {
            id: {
                type: Sequelize.INTEGER(11),
                autoIncrement: true,
                primaryKey: true
            },
            food: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            culture_plast_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false
            },
            user_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false
            },
            url_image: {
                type: Sequelize.TEXT
            },
            description: {
                type: Sequelize.TEXT
            },
            country: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            recipe: {
                type: Sequelize.TEXT
            },
        });


        Food_name.associate = (models) => {
            Food_name.hasMany(models.favorite, {
                foreignKey: 'food_name_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                sourceKey: 'id'
            });
            Food_name.belongsTo(models.user, {
                foreignKey: 'user_id'
            });
    
            Food_name.belongsTo(models.culture_plast, {
                foreignKey: 'culture_plast_id'
            });
    
        };
        return Food_name;
};