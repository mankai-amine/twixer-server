const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Post = require('./Post');
const Like = require('./Like');

class Reply extends Model {}

Reply.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Post,
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
                model: User,
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
                model: Reply,
                key: 'id',
            },
        }
    }
);

Reply.belongsTo(User, {foreignKey: 'user_id' });
Reply.belongsTo(Post, {foreignKey: 'post_id' });
Reply.hasMany(Like, {foreignKey: 'reply_id' });

module.exports = Reply;