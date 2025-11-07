module.exports = (sequelize, Sequelize) => {
    var Culture_plast = sequelize.define(
        'culture_plast',
        {
            id: {
                type: Sequelize.INTEGER(10),
                autoIncrement: true,
                primaryKey: true
            },
            culture: {
                type: Sequelize.STRING(50),
                allowNull: false
            }
        });

        Culture_plast.associate = (models) => {
            Culture_plast.hasMany(models.food_name, {
            foreignKey: 'culture_plast_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            sourceKey: 'id'
        });
    };
    return Culture_plast;
};