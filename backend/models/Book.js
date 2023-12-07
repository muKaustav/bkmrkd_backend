module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define('Book', {
        book_id: {
            type: DataTypes.INTEGER,
            autoIncrement: 36489666,
            primaryKey: true,
        },
        title_without_series: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [2, 5000],
            },
        },
        author: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: [2, 5000],
            },
        },
        book_description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [2, 50000],
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
                len: [2, 5000],
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
                len: [2, 5000],
            },
        },
        book_url: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: [2, 5000],
            },
        },
        is_ebook: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: [2, 5000],
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
    })

    Book.associate = models => {
        Book.belongsToMany(models.Bookshelf, {
            through: 'BookshelfBook',
            foreignKey: 'book_id',
            onDelete: 'CASCADE',
        })
    }

    return Book
}
