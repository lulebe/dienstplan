const tmpl = require.main.require('./templates')
const { Plan, Shift, PlanNote, User, ShiftOption } = require.main.require('./db')
const dates = require.main.require('./dates')
const XLSX = require('xlsx')

module.exports = async (req, res) => {
  const plan = await Plan.findByPk(req.params.planId, {include: [{model: Shift, include: ['pickedUser', {model: ShiftOption, include: User}]}, {model: PlanNote, include: User}]})
  const rows = []
  rows.push(["Dienstplan studentische Hilfskräfte " + plan.name])
  rows.push([])
  rows.push(["Schicht", "Name", "Telefon", "E-Mail"])
  rows.push([])
  plan.Shifts.sort((s1, s2) => s1.start < s2.start).forEach(shift => {
    rows.push([
      dates.displayShiftDate(shift.start) + " " + dates.displayShiftTime(shift.start) + "-" + dates.displayShiftTime(shift.end),
      shift.pickedUser ? shift.pickedUser.fullName : "/",
      shift.pickedUser ? shift.pickedUser.phone : "",
      shift.pickedUser ? shift.pickedUser.email : ""
    ])
  })
  const wb = XLSX.utils.book_new()
  const sheet = XLSX.utils.aoa_to_sheet(rows)
  sheet['!cols'] = [{wch: 52}, {wch: 25}, {wch: 20}, {wch: 25}]
  XLSX.utils.book_append_sheet(wb, sheet, plan.name)
  const buf = XLSX.write(wb, {type:'buffer', bookType: "xlsx"})
  res.status(200)
  res.setHeader('Content-Disposition', 'attachment; filename="dienstplan_stud_' + plan.name.replace(' ', '_').toLowerCase() + 'xlsx"')
  res.setHeader('content-type', "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
  res.send(buf)
}
