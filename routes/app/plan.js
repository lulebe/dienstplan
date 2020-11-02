const tmpl = require.main.require('./templates')
const { Plan, Shift, PlanNote, User } = require.main.require('./db')
const dates = require.main.require('./dates')

module.exports = async (req, res) => {
  const plan = await Plan.findByPk(req.params.planId, {include: [{model: Shift, include: ['pickedUser', User]}, {model: PlanNote, include: User}]})
  res.tmplOpts.plan = plan.dataValues
  res.tmplOpts.plan.Shifts = res.tmplOpts.plan.Shifts.map(shift => ({
    id: shift.id,
    priority: shift.priority,
    start: shift.start,
    end: shift.end,
    startDateDisplay: dates.displayShiftDate(shift.start),
    startTimeDisplay: dates.displayShiftTime(shift.start),
    endTimeDisplay: dates.displayShiftTime(shift.end),
    pickedUser: shift.User ? {id: shift.User.id, name: shift.user.firstName + ' ' + shift.user.lastName} : null
  }))
  const otherNotes = []
  res.tmplOpts.plan.PlanNotes.forEach(note => {
    if (note.UserId !== req.user.id) otherNotes.push(note)
    else res.tmplOpts.plan.myNote = note
  })
  res.tmplOpts.plan.PlanNotes = otherNotes
  res.tmplOpts.plan.start = dates.displayDate(res.tmplOpts.plan.start)
  res.tmplOpts.plan.end = dates.displayDate(res.tmplOpts.plan.end)
  tmpl.render('app/plan.twig', res.tmplOpts).then(rendered => res.end(rendered))
}