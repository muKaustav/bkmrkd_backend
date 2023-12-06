'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Bookshelves', 'bookshelf_type', {
      type: Sequelize.STRING,
      defaultValue: 'PRIVATE',
      allowNull: false,
      validate: {
        isIn: [['PRIVATE', 'PUBLIC']],
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Bookshelves', 'bookshelf_type')
  },
}