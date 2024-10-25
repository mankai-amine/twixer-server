const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class Posts extends Model {}

Posts.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
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
        orig_post_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Posts,
                key: 'id',
            },
        }
    }
);