module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Post,
                key: 'id',
            },
        },
        reply_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Reply,
                key: 'id',
            },
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        }
        
    }, {
        tableName: 'likes',
        validate: {
            onlyOneReference() {
                if ((this.post_id === null && this.reply_id === null) || (this.post_id !== null && this.reply_id !== null)) {
                    throw new Error("A like must be associated with either a post or a reply, not both.");
                }
            }
        }  
    });

    Like.associate = (models) => {
        Like.belongsTo(models.Post, {
            foreignKey: 'post_id',
        });

        Like.belongsTo(models.Reply, {
            foreignKey: 'reply_id',
        });

        Like.belongsTo(models.User, {
            foreignKey: 'user_id',
        });
    };

    return User;
}