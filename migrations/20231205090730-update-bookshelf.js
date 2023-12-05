'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new column
    await queryInterface.addColumn('Bookshelves', 'rating', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    })

    // Rename existing columns
    await queryInterface.renameColumn('Bookshelves', 'bookshelf_id', 'id')
    await queryInterface.renameColumn('Bookshelves', 'bookshelf_type', 'type')
    await queryInterface.renameColumn('Bookshelves', 'bookshelf_name', 'name')
    await queryInterface.renameColumn('Bookshelves', 'bookshelf_description', 'description')
    await queryInterface.renameColumn('Bookshelves', 'bookshelf_image', 'image')
  },

  down: async (queryInterface, Sequelize) => {
    // Remove new column
    await queryInterface.removeColumn('Bookshelves', 'rating')

    // Rename back existing columns
    await queryInterface.renameColumn('Bookshelves', 'id', 'bookshelf_id')
    await queryInterface.renameColumn('Bookshelves', 'type', 'bookshelf_type')
    await queryInterface.renameColumn('Bookshelves', 'name', 'bookshelf_name')
    await queryInterface.renameColumn('Bookshelves', 'description', 'bookshelf_description')
    await queryInterface.renameColumn('Bookshelves', 'image', 'bookshelf_image')
  },
}
