module.exports = (sequelize, DataTypes) => {
    const Bookshelf = sequelize.define('Bookshelf', {
        bookshelf_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        owner: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 50000],
            },
        },
        bookshelf_type: {
            type: DataTypes.STRING,
            defaultValue: 'PRIVATE',
            validate: {
                isIn: [['PRIVATE', 'PUBLIC']],
            },
        },
        bookshelf_name: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [2, 50000],
            },
        },
        bookshelf_description: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: [2, 50000],
            },
        },
        bookshelf_image: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: [2, 50000],
            },
        },
    }, {
        timestamps: true,
    })

    Bookshelf.associate = models => {
        Bookshelf.belongsTo(models.User, {
            foreignKey: 'owner',
            targetKey: 'id',
            onDelete: 'CASCADE',
        })

        Bookshelf.belongsToMany(models.Book, {
            through: 'BookshelfBook',
            foreignKey: 'bookshelf_id',
            onDelete: 'CASCADE',
        })
    }

    return Bookshelf
}
