'use strict';

//Generate a skeleton migration via command line:
//npx sequelize-cli migration:generate --name migration-skeleton

//Migrate changes to db
//npx sequelize-cli db:migrate

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('StravaAccounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
            model: "Users",
            key: "id"
          }
        },
      username: {
        type: Sequelize.TEXT
      },
      athlete_id: {
        type: Sequelize.BIGINT
      },
      auth_token: {
        type: Sequelize.TEXT
      },
      auth_token_expires_at: {
          type: Sequelize.DATE
      },
      refresh_token: {
        type: Sequelize.TEXT
      },
      profile_pic: {
        type: Sequelize.TEXT
      },
      bio: {
        type: Sequelize.TEXT
      },
      firstname: {
        type: Sequelize.TEXT
      },
      lastname: {
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
    await queryInterface.dropTable('StravaAccounts');
  }
};