'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/db.config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  // This allows me to set use_env_variable in config.js for an app tier like development or production
  //        "development": { "use_env_variable": "DATABASE_URL"}
  // and then it'll pull the entire connection string from the environment variable DATABASE_URL
  // which will be hella easy in Heroku
  console.log('SEQUELIZE USING config.use_env_variable');
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  console.log('SEQUELIZE NOT using config.use_env_variable');
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    console.log('SEQUELIZE BEFORE ASSOCIATING MODEL['+modelName+'] to db');
    db[modelName].associate(db);
    console.log('SEQUELIZE AFTER ASSOCIATING MODEL['+modelName+'] to db');
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
