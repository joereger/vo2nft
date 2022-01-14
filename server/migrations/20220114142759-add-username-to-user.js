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
        queryInterface.addColumn('Users', 'username', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t })
        // .then(async() =>
        //   // add a rando username
        //   await queryInterface.sequelize.query(`update "Users" set "username" = array_to_string(array(select string_agg(substring('0123456789bcdfghjkmnpqrstvwxyz', round(random() * 30)::integer, 1), '') from generate_series(1, 9) where "Users.username" is distinct from 'something'), '');`))
        //   .then(async() =>
        //   // Add the NOT NULL and UNIQUE constraints
        //   queryInterface.changeColumn('Users', 'username', {type: Sequelize.STRING, allowNull: false, unique: true}))
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
        queryInterface.removeColumn('Users', 'username', { transaction: t })
      ]);
    });
  }

};
