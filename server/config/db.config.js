require('dotenv').config(); 
module.exports = {
  production: {
      "username": process.env.DB_USERNAME,
      "password": process.env.DB_PASSWORD,
      "database": process.env.DB_DATABASE,
      "host": process.env.DB_HOST,
      "dialect": "postgres"
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


