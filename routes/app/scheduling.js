const tmpl = require.main.require('./templates')
const { Plan, Shift, PlanNote, User, ShiftOption } = require.main.require('./db')
const dates = require.main.require('./dates')

module.exports = async (req, res) => {
  const plan = await Plan.findByPk(req.params.planId, {include: [{model: Shift, include: ['pickedUser', {model: ShiftOption, include: User}]}, {model: PlanNote, include: User}]})
  res.tmplOpts.plan = plan.dataValues
  res.tmplOpts.plan.Shifts = res.tmplOpts.plan.Shifts.map(shift => {
    return {
      id: shift.id,
      priority: shift.priority,
      start: shift.start,
      end: shift.end,
      startDateDisplay: dates.displayShiftDate(shift.start),
      startTimeDisplay: dates.displayShiftTime(shift.start),
      endTimeDisplay: dates.displayShiftTime(shift.end),
      pickedUser: shift.pickedUser ? {id: shift.pickedUser.id, name: shift.pickedUser.fullName} : null,
      options: shift.ShiftOptions
    }
  })
  res.tmplOpts.shiftOptions = JSON.stringify([])
  res.tmplOpts.plan.start = dates.displayDate(res.tmplOpts.plan.start)
  res.tmplOpts.plan.end = dates.displayDate(res.tmplOpts.plan.end)
  tmpl.render('app/scheduling.twig', res.tmplOpts).then(rendered => res.end(rendered))
}