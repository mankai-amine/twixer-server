module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define("Post", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING(560),
            allowNull: false,
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        orig_post_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'posts',
                key: 'id',
            },
        }
    }, {
        tableName: 'posts',
        timestamps: false,
    });

    Post.associate = (models) => {
        Post.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'poster'
        });

        Post.hasMany(models.Reply, {
            foreignKey: 'post_id',
            as: 'replies'
        });

        Post.hasMany(models.Like, {
            foreignKey: 'post_id',
            as: 'likes'
        });

        Post.hasMany(models.Post, {
            foreignKey: 'orig_post_id',
            as: 'reposts'
        });

        Post.belongsTo(models.Post, {
            foreignKey: 'orig_post_id',
            as: 'originalPost'
        });
    };

    return Post;
}
