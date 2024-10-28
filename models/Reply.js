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




// const { DataTypes, Model } = require('sequelize');
// // const sequelize = require('../config/config');
// // const User = require('./User');
// // const Post = require('./Post');
// // const Like = require('./Like');

// class Reply extends Model {}

// Reply.init(
//     {
//         id: {
//             type: DataTypes.INTEGER,
//             autoIncrement: true,
//             primaryKey: true,
//         },
//         post_id: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: 'Posts',
//                 key: 'id',
//             },
//         },
//         date: {
//             type: DataTypes.DATE,
//             defaultValue: DataTypes.NOW,
//             allowNull: false,
//         },
//         user_id: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: 'User',
//                 key: 'id',
//             },
//         },
//         content: {
//             type: DataTypes.STRING(280),
//             allowNull: false,
//         },
//         orig_reply_id: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//             references: {
//                 model: 'Reply',
//                 key: 'id',
//             },
//         }
//     },
//     {
//         sequelize,
//         modelName: 'Reply',
//         timestamps: false,
//     }
// );

// Reply.belongsTo(User, {foreignKey: 'user_id' });
// Reply.belongsTo(Post, {foreignKey: 'post_id' });
// Reply.hasMany(Like, {foreignKey: 'reply_id' });

// module.exports = Reply;