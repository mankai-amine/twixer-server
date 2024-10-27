module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        role: {
            type: DataTypes.ENUM('user', 'premium_user', 'admin'),
            allowNull: false,
            defaultValue: 'user'
        },
        email:{
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        username:{
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        password:{
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        bio:{
            type: DataTypes.STRING(160),
            allowNull: true,
        },
        creation_date:{
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        account_status:{
            type: DataTypes.ENUM('active', 'unverified', 'banned'),
            defaultValue: 'active',
            allowNull: false
        },
        profile_pic:{
            type: DataTypes.TEXT,
            allowNull: true
        },
        
    }, {
        tableName: 'users'  
    });

    User.associate = (models) => {
        User.hasMany(models.Post, {
            foreignKey: 'user_id',  // Foreign key in Post model
            as: 'posts'             // Alias for including posts
        });

        User.hasMany(models.Reply, {
        foreignKey: 'user_id',  
        as: 'replies'           
        });

        User.hasMany(models.Like, {
            foreignKey: 'user_id',  
            as: 'likes'           
        });

        User.hasMany(models.Follow, {
            foreignKey: 'user_id',  
            as: 'follows'           
        });
    };

    return User;
}