const config = require.main.require('./config')
const { User } = require.main.require('./db')

module.exports = async (req, res, next) => {
  const u = await User.findByPk(req.params.userId)
  if (!u) return res.status(404).send()
  if (req.body.makeAdmin) {
    u.isAdmin = true
    await u.save()
  }
  if (req.body.removeAdmin) {
    u.isAdmin = false
    await u.save()
  }
  if (req.body.delete) {
    await u.destroy()
    return res.redirect('/app/admin')
  }
  next()
}