'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Bookshelves', 'user_id', 'owner')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Bookshelves', 'owner', 'user_id')
  },
};

