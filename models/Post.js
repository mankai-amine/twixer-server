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
    };

    return Post;
}







// const { DataTypes, Model } = require('sequelize');
// // const sequelize = require('../config/config');
// // const User = require('./User');
// // const Like = require('./Like');
// // const Reply = require('./Reply');

// class Post extends Model {}

// Post.init(
//     {
//         id: {
//             type: DataTypes.INTEGER,
//             autoIncrement: true,
//             primaryKey: true,
//         },
//         user_id: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: User,
//                 key: 'id',
//             },
//         },
//         date: {
//             type: DataTypes.DATE,
//             defaultValue: DataTypes.NOW,
//             allowNull: false,
//         },
//         content: {
//             type: DataTypes.STRING(560),
//             allowNull: false,
//         },
//         is_deleted: {
//             type: DataTypes.BOOLEAN,
//             allowNull: false,
//             defaultValue: false,
//         },
//         orig_post_id: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//             references: {
//                 model: Post,
//                 key: 'id',
//             },
//         }
//     },
//     {
//         sequelize,
//         modelName: 'Post',
//         timestamps: false,
//     }
// );

// Post.belongsTo(User, {foreignKey: 'user_id' });
// Post.hasMany(Like, {foreignKey: 'post_id' });
// Post.hasMany(Reply, {foreignKey: 'post_id'});

// module.exports = Post;