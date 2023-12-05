module.exports = (sequelize, DataTypes) => {
    const Bookshelf = sequelize.define('Bookshelf', {
        id: {
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
        type: {
            type: DataTypes.STRING,
            defaultValue: 'PRIVATE',
            validate: {
                isIn: [['PRIVATE', 'PUBLIC']],
            },
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: [2, 50000],
            },
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        image: {
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
