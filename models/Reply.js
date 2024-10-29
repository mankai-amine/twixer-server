module.exports = (sequelize, DataTypes) => {
    const Reply = sequelize.define("Reply", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'posts',
                key: 'id',
            },
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        content: {
            type: DataTypes.STRING(280),
            allowNull: false,
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        orig_reply_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'replies',
                key: 'id',
            },
        }
    }, {
        tableName: 'replies',
        timestamps: false,
    });

    Reply.associate = (models) => {
        Reply.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'replier'
        });

        Reply.belongsTo(models.Post, {
            foreignKey: 'post_id',
            as: 'post'
        });
        
        Reply.hasMany(models.Like, {
            foreignKey: 'reply_id',
            as: 'likes'
        });
    };

    return Reply;
}
