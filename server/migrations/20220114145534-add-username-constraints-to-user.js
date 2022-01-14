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
        queryInterface.changeColumn('Users', 'username', {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
          unique: true
        }, { transaction: t })
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
        queryInterface.changeColumn('Users', 'username', {
          type: Sequelize.DataTypes.STRING,
          allowNull: true,
          unique: false
        }, { transaction: t })
      ]);
    });
  }

};
