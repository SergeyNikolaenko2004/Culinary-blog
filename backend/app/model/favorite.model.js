module.exports = (sequelize, Sequelize) => {
    var Favorite = sequelize.define(
        'favorite',
        {
            id: {
                type: Sequelize.INTEGER(11),
                autoIncrement: true,
                primaryKey: true
            },
            user_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false
            },
            food_name_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false
            }
        });


        Favorite.associate = (models) => {
            Favorite.belongsTo(models.user, {
                foreignKey: 'user_id'
            });
    
            Favorite.belongsTo(models.culture_plast, {
                foreignKey: 'food_name_id:'
            });
            
    
        };
        return Favorite;
};