module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: true,
            validate: {
                min: 0.5,
                max: 5,
            },
        },
    }, {
        timestamps: true,
    })

    Review.associate = (models) => {
        Review.belongsTo(models.User, {
            foreignKey: {
                name: 'userId',
                allowNull: false,
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
        })

        Review.belongsTo(models.Book, {
            foreignKey: {
                name: 'bookId',
                allowNull: false,
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
        })
    }

    return Review
}
