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
  },
  priority: {
    type: DataTypes.TINYINT,
    allowNull: false
  }
}, {timestamps: false})

const ShiftOption = sequelize.define('ShiftOption', {
  ifNeeded: {
    type: DataTypes.BOOLEAN
  }
}, {timestamps: false})

const PlanNote = sequelize.define('PlanNote', {
  maxNights: {
    type: DataTypes.INTEGER
  },
  maxDays: {
    type: DataTypes.INTEGER
  },
  Notes: {
    type: DataTypes.TEXT
  }
}, {timestamps: false})

Plan.hasMany(Shift, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
Shift.belongsTo(Plan)

Shift.belongsToMany(User, {
  through: ShiftOption,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
User.belongsToMany(Shift, {
  through: ShiftOption,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

User.hasMany(Shift, {
  as: 'pickedShifts',
  foreignKey: 'userId'
})
Shift.belongsTo(User, {as: 'pickedUser', foreignKey: 'userId'})

User.hasMany(PlanNote, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
PlanNote.belongsTo(User)

Plan.hasMany(PlanNote, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
PlanNote.belongsTo(Plan)

const sessionStore = new SequelizeStore({
  db: sequelize
})

async function init () {
  return await sequelize.sync({force: true})
}
module.exports = { User, Plan, Shift, PlanNote, ShiftOption, init, sessionStore }