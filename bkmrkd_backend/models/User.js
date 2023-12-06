const bcrypt = require('bcrypt')
const { Snowflake } = require('@theinternetfolks/snowflake')

module.exports = (sequelize, DataTypes, models) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.STRING,
            defaultValue: () => Snowflake.generate(),
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
            validate: {
                len: [2, 255],
            },
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                len: [2, 255],
            },
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                len: [2, 255],
            }
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'USER',
            validate: {
                isIn: [['USER', 'ADMIN']],
            },
        }
    }, {
        timestamps: true,
    })

    User.prototype.compare = async function (password) {
        return await bcrypt.compare(password, this.password)
    }

    User.beforeCreate(async (user, options) => {
        if (user.password) {
            user.password = await bcrypt.hash(user.password, 10)
        }
    })

    User.associate = models => {
        User.hasMany(models.Bookshelf, {
            foreignKey: 'owner',
        })
    }

    return User
}