module.exports = (sequelize, DataTypes) => {
    const Follow = sequelize.define("Follow", {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        follower_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        followee_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        
    }, {
        tableName: 'follows',
        timestamps: false,
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
