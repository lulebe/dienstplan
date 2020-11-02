const { Op } = require("sequelize")

const { Plan } = require.main.require('./db')

module.exports = async (req, res, next) => {
  req.plan = await Plan.findByPk(req.params.planId)
  if (req.body.shiftPicks) await saveOptions(req, res)
  next()
}


async function saveOptions (req, res) {
  const picks = JSON.parse(req.body.shiftPicks)
  const shifts = await req.plan.getShifts()
  await Promise.all(shifts.map(shift => {
    shift.userId = parseInt(picks[shift.id]) || null
    return shift.save()
  }))
}