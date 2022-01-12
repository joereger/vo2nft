'use strict';

//Generate a skeleton migration via command line:
//npx sequelize-cli migration:generate --name migration-skeleton

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     */
    // return queryInterface.sequelize.transaction(t => {
    //   return Promise.all([
    //     queryInterface.addColumn('Users', 'password_salt', {
    //       type: Sequelize.DataTypes.STRING,
    //       allowNull: false
    //     }, { transaction: t })
    //   ]);
    // });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     */
    // return queryInterface.sequelize.transaction(t => {
    //   return Promise.all([
    //     queryInterface.removeColumn('Users', 'password_salt', { transaction: t })
    //   ]);
    // });
  }
};
