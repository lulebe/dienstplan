const sgMail = require('@sendgrid/mail')

const config = require('./config')

sgMail.setApiKey(config.SENDGRID_KEY)

module.exports = function (email, subject, name, text, html) {
  return sgMail.send({
    to: email,
    from: 'dienstplan@lulebe.net',
    subject,
    text: 'Hallo ' + name + ',\n\n' + text + '\n\nViele Grüße,\ndas Dienstplan-Team',
    html: 'Hallo ' + name + ',<br><br>' + html + '<br><br>Viele Grüße,<br>das Dienstplan-Team'
  })
}