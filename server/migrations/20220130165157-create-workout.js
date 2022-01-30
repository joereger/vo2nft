'use strict';

//const { DataTypes } = require("sequelize/dist");

//Generate a skeleton migration via command line:
//npx sequelize-cli migration:generate --name migration-skeleton

//Migrate changes to db
//npx sequelize-cli db:migrate

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Workouts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userid_currentowner: {
        type: Sequelize.INTEGER
      },
      userid_creator: {
        type: Sequelize.INTEGER
      },
      external_account_type: {
        type: Sequelize.TEXT
      },
      external_account_id: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.TEXT
      },
      workout_date: {
        type: Sequelize.DATE
      },
      title: {
        type: Sequelize.TEXT
      },
      url: {
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.TEXT
      },
      strava_details: {
        type: Sequelize.JSONB
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
    await queryInterface.dropTable('Workouts');
  }
};