module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        follower_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        followee_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        
    }, {
        tableName: 'follows'  
    });

    Follow.associate = (models) => {
        Follow.belongsTo(models.User, {
            foreignKey: 'follower_id',
            as: 'follower',
        });

        Follow.belongsTo(models.User, {
            foreignKey: 'followee_id',
            as: 'followee',
        });
    };

    return Follow;
}
