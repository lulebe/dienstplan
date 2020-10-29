const sgMail = require('@sendgrid/mail')

const config = require('./config')

sgMail.setApiKey(config.SENDGRID_KEY)

module.exports = function (email, subject, text) {
  return sgMail.send({
    to: email,
    from: 'dienstplan@lulebe.net',
    subject,
    text
  })
}