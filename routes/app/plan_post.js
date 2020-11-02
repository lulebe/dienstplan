const config = require.main.require('./config')
const { User, Plan, PlanNote } = require.main.require('./db')

module.exports = async (req, res, next) => {
  req.plan = await Plan.findByPk(req.params.planId)
  if (req.body.saveNote) await saveNote(req, res)
  if (req.body.saveOptions) await saveOptions(req, res)
  next()
}

async function saveNote (req, res) {
  const [note, created] = await PlanNote.findOrCreate({
    where: { UserId: req.user.id, PlanId: req.plan.id },
    defaults: {
      Notes: ""
    }
  })
  note.Notes = req.body.note
  await note.save()
}

async function saveOptions (req, res) {

}