
const Validator = require('validatorjs');
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Book = sequelize.define('Book', {
        book_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title_without_series: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [2, 50000], 
                validator: (value) => {
                    const validation = new Validator(
                        { title_without_series: value },
                        { title_without_series: 'required|TEXT|min:2|max:50000' }
                    );
                    if (validation.fails()) {
                        throw new Error(validation.errors.first('title_without_series'));
                    }
                },
            },
        },
        book_description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [2, 50000], 
                validator: (value) => {
                    const validation = new Validator(
                        { book_description: value },
                        { book_description: 'required|TEXT|min:2|max:50000' }
                    );
                    if (validation.fails()) {
                        throw new Error(validation.errors.first('book_description'));
                    }
                },
            },
        },
        publication_year: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        publisher: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: [2, 50000], 
            },
        },
        ratings_count: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        book_average_rating: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        cover_page: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: [2, 50000], 
            },
        },
        book_url: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: [2, 50000], 
            },
        },
        is_ebook: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: [2, 50000], 
            },
        },
        num_pages: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: true,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: true,
        }
    });

    return Book;
};
