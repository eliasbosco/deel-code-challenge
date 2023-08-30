const fs = require('fs')
const path = require('path')
const { Sequelize } = require('sequelize')
const basename = path.basename(__filename)
const { logger } = require('../helpers/logger')
const db = {}

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_FILENAME || '../../db/database.sqlite3',
    pool: {
        max: parseInt(process.env.DB_POOL_MAX) || 5,
        min: parseInt(process.env.DB_POOL_MIN) || 1,
        acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 10000,
        idle: parseInt(process.env.DB_POOL_IDLE) || 10000,
    },
})

fs.readdirSync(__dirname).filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
}).forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize);
    db[model.name] = model;
})

sequelize.sync({ alter: (process.env.DB_ALTER_DDL === 'true') }).catch(e => logger.error(e));

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db