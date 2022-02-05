'use strict';

//Generate a skeleton migration via command line:
//npx sequelize-cli migration:generate --name migration-skeleton

//Migrate changes to db
//npx sequelize-cli db:migrate

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Workouts', 'workout_id', { transaction: t }),
        queryInterface.removeColumn('Workouts', 'external_account_id', { transaction: t })
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        
      ]);
    });
  }

};
