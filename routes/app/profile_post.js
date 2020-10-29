const bcrypt = require('bcrypt')

const config = require.main.require('./config')
const { User } = require.main.require('./db')

module.exports = async (req, res, next) => {
  if (req.body.pwnew && req.body.pwold && req.body.pwnewmatch) {
    if (req.body.pwnew === req.body.pwnewmatch) {
      const pwCorrect = await bcrypt.compare(req.body.pwold, req.user.password)
      if (pwCorrect) {
        req.user.password = await bcrypt.hash(req.body.pwnew, await bcrypt.genSalt(config.SALT_ROUNDS))
        await req.user.save()
        res.tmplOpts.successMsg = "Passwort wurde geändert."
      }
    } else
      res.tmplOpts.errorMsg = "Passwörter stimmen nicht überein."
  }
  next()
}