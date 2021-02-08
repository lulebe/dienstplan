const { Op } = require("sequelize")

const { Plan, PlanNote, ShiftOption, Shift } = require.main.require('./db')

module.exports = async (req, res, next) => {
  req.plan = await Plan.findByPk(req.params.planId)
  if (req.body.note) await saveNote(req, res)
  if (req.body.shiftOptions) await saveOptions(req, res)
  next()
}

async function saveNote (req, res) {
  const [note, created] = await PlanNote.findOrCreate({
    where: { UserId: req.user.id, PlanId: req.plan.id },
    defaults: {
      Notes: ""
    }
  })
  note.maxNights = req.body.maxNights
  note.maxDays = req.body.maxDays
  note.Notes = req.body.note || ""
  await note.save()
}

async function saveOptions (req, res) {
  const opts = JSON.parse(req.body.shiftOptions)
  const oldOptions = await ShiftOption.findAll({
    where: {
      UserId: req.user.id,
      '$Shift.PlanId$': { [Op.eq]: req.plan.id }
    },
    include: [{
      model: Shift
    }]
  })
  await Promise.all(oldOptions.map(oo => oo.destroy()))
  await ShiftOption.bulkCreate(opts.filter(o => o.status > 0).map(o => ({
    UserId: req.user.id,
    ShiftId: o.id,
    ifNeeded: o.status === 2
  })))
}