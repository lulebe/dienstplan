const { Plan } = require.main.require('./db')

module.exports = async (req, res) => {
  await Plan.destroy({
    where: {
      id: req.params.planId
    }
  })
  res.redirect('/app/main')
}