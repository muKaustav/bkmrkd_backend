const bcrypt = require('bcrypt')
const Validator = require('validatorjs')
const { Snowflake } = require('@theinternetfolks/snowflake')

module.exports = (sequelize, DataTypes) => {
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
                validator: (value) => {
                    const validation = new Validator({ name: value }, { name: 'required|string|min:2|max:255' })
                    if (validation.fails()) {
                        throw new Error(validation.errors.first('name'))
                    }
                },
            },
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                validator: (value) => {
                    const validation = new Validator({ email: value }, { email: 'required|email' })
                    if (validation.fails()) {
                        throw new Error(validation.errors.first('email'))
                    }
                },
            },
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                validator: (value) => {
                    const validation = new Validator({ password: value }, { password: 'required|string|min:2|max:255' })
                    if (validation.fails()) {
                        throw new Error(validation.errors.first('password'))
                    }
                },
            }
        },
        role:{
            type: DataTypes.STRING,
            defaultValue: 'USER',
            validate: {
                validator: (value) => {
                    const validation = new Validator({ role: value }, { role: 'required|string' })
                    if (validation.fails()) {
                        throw new Error(validation.errors.first('role'))
                    }
                },
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

    return User
}