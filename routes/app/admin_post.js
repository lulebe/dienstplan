const bcrypt = require('bcrypt')
const sgMail = require('@sendgrid/mail')
const generator = require('generate-password')

const config = require.main.require('./config')
const { User } = require.main.require('./db')

module.exports = async (req, res, next) => {
  if (req.body.createUser) {
    if (req.body.firstName && req.body.lastName && req.body.email) {
      const pw = generator.generate({length: 10, numbers: true})
      await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
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
  return sgMail.send({
    to: email,
    from: 'dienstplan@lulebe.net',
    subject: 'Account erstellt',
    text: 'Hallo ' + name + ',\n\ndein Account auf dienstplan.lulebe.net wurde mit folgendem Passwort angelegt:\n\n' + pw
  })
}