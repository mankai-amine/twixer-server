module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define("Like", {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'posts',
                key: 'id',
            },
        },
        reply_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'replies',
                key: 'id',
            },
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        }
        
    }, {
        tableName: 'likes',
        timestamps: false,
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

    return Like;
}