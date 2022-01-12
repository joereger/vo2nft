'use strict';

//Generate a skeleton migration via command line:
//npx sequelize-cli migration:generate --name migration-skeleton

//Migrate changes to db
//npx sequelize-cli db:migrate

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: Sequelize.TEXT
      },
      password_salt: {
        type: Sequelize.TEXT
      },
      activation_key: {
        type: Sequelize.STRING
      },
      reset_password_key: {
          type: Sequelize.STRING
      },
      verified: {
          type: Sequelize.BOOLEAN
      },
      refresh_token: { 
          type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};