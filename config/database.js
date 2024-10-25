const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('TOFIX', 'REDACTED', 'REDACTED', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;