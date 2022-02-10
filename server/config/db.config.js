require('dotenv').config(); 
module.exports = {
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    protocol: 'postgres',
    ssl: true,
    logging: true,
    dialectOptions: {
      ssl: {
       require: true,
       rejectUnauthorized: false,
      }
    }
   },
  development: {
      "username": "joereger",
      "password": "password",
      "database": "vo2nft_dev",
      "host": "127.0.0.1",
      "dialect": "postgres",
      logging: false
  }
};


