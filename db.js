const { Sequelize, DataTypes } = require('sequelize')
const session = require('express-session')
const SequelizeStore = require("connect-session-sequelize")(session.Store)

const config = require('./config')

const sequelize = new Sequelize('dienstplan', config.DB_USER, config.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mariadb'
})

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
})

const Plan = sequelize.define('Plan', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  start: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end: {
    type: DataTypes.DATE,
    allowNull: false
  }
})

const Shift = sequelize.define('Shift', {
  start: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end: {
    type: DataTypes.DATE,
    allowNull: false
  }
})

Plan.hasMany(Shift)
Shift.belongsTo(Plan)

Shift.belongsToMany(User, {through: 'ShiftOptions'})
User.belongsToMany(Shift, {through: 'ShiftOptions'})

User.hasMany(Shift, {foreignKey: 'pickedUser'})
Shift.belongsTo(User)

const sessionStore = new SequelizeStore({
  db: sequelize
})

async function init () {
  const userSync = User.sync({alter: true})
  const planSync = Plan.sync({alter: true})
  const shiftSync = Shift.sync({alter: true})
  const sessionSync = sessionStore.sync()
  return await Promise.all([userSync, planSync, shiftSync, sessionSync])
}
module.exports = { User, Plan, Shift, init, sessionStore }