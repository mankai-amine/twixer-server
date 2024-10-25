const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class Post extends Model {}

Post.init(
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
                model: Post,
                key: 'id',
            },
        }
    }
);

Post.belongsTo(User, {foreignKey: 'user_id' });
Post.hasMany(Like, {foreignKey: 'post_id' });
Post.hasMany(Reply, {foreignKey: 'post_id'});

module.exports = Post;