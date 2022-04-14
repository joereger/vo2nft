'use strict';

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
        queryInterface.addColumn('Workouts', 'price_in_eth', {
          type: Sequelize.DataTypes.DOUBLE
        }, { transaction: t }),
        queryInterface.addColumn('Workouts', 'is_price_default', {
          type: Sequelize.DataTypes.BOOLEAN
        }, { transaction: t }), 
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
        queryInterface.removeColumn('Workouts', 'price_in_eth', { transaction: t }),
        queryInterface.removeColumn('Workouts', 'is_price_default', { transaction: t })
      ]);
    });
  }

};
