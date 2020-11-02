const bcrypt = require('bcrypt')
const generator = require('generate-password')

const config = require.main.require('./config')
const { User } = require.main.require('./db')
const mailer = require.main.require('./email')

module.exports = async (req, res, next) => {
  if (req.body.createUser) {
    if (req.body.firstName && req.body.lastName && req.body.email) {
      const pw = generator.generate({length: 10, numbers: true})
      await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        isAdmin: !!req.body.isAdmin,
        password: await bcrypt.hash(pw, await bcrypt.genSalt(config.SALT_ROUNDS))
      })
      sendPwMail(req.body.email, req.body.firstName + ' ' + req.body.lastName, pw)
      res.tmplOpts.successMsg = "Nutzer erfolgreich angelegt"
    } else {
      res.tmplOpts.errorMsg = "Bitte alle Felder ausfüllen."
    }
  }
  next()
}

function sendPwMail (email, name, pw) {
  return mailer(
    email,
    'Account erstellt',
    name,
    'dein Account auf dienstplan.lulebe.net wurde mit folgendem Passwort angelegt:\n\n' + pw,
    'dein Account auf <a href="dienstplan.lulebe.net">dienstplan.lulebe.net</a> wurde mit folgendem Passwort angelegt:<br><br><pre>' + pw + '</pre>'
  )
}