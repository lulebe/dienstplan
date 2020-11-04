const { User } = require.main.require('./db')

module.exports = async (req, res, next) => {
  const u = await User.findByPk(req.params.userId)
  if (!u) return res.status(404).send()
  if (req.body.makeAdmin) {
    u.isAdmin = true
    await u.save()
    res.tmplOpts.successMsg = "Änderungen gespeichert."
  }
  if (req.body.removeAdmin) {
    u.isAdmin = false
    await u.save()
    res.tmplOpts.successMsg = "Änderungen gespeichert."
  }
  if (req.body.mailChange) await mailChange(u, req, res, next)
  if (req.body.nameChange) await nameChange(u, req, res, next)
  if (req.body.phoneChange) await phoneChange(u, req, res, next)
  if (req.body.delete) {
    await u.destroy()
    return res.redirect('/app/admin')
  }
  next()
}

async function nameChange (u, req, res) {
  if (req.body.firstName && req.body.lastName) {
    u.firstName = req.body.firstName
    u.lastName = req.body.lastName
    await u.save()
    res.tmplOpts.successMsg = "Änderungen gespeichert."
  }
}

async function phoneChange (u, req, res) {
  if (req.body.phone) {
    u.phone = req.body.phone
    await u.save()
    res.tmplOpts.successMsg = "Änderungen gespeichert."
  }
}

async function mailChange (u, req, res) {
  if (req.body.newmail) {
    const oldmail = u.email
    u.email = req.body.newmail
    await u.save()
    res.tmplOpts.successMsg = "Änderungen gespeichert."
  }
}