const bcrypt = require('bcrypt')
const generator = require('generate-password')
const sgMail = require('@sendgrid/mail')

const config = require.main.require('./config')
const { User } = require.main.require('./db')

sgMail.setApiKey(config.SENDGRID_KEY)

module.exports = async (req, res) => {
  console.log(req.body.email)
  if (!req.body.email)
    return res.redirect('/?status=0')
  const foundUser = await User.findOne({where: {email: req.body.email}})
  if (!foundUser)
    return res.redirect('/?status=2')
  const pw = generator.generate({length: 10, numbers: true})
  foundUser.password = await bcrypt.hash(pw, await bcrypt.genSalt(config.SALT_ROUNDS))
  await foundUser.save()
  console.log(foundUser.email, pw)
  await sendEmail(foundUser.email, foundUser.firstName + ' ' + foundUser.lastName, pw)
  res.redirect('/?status=1')
}

function sendEmail (email, name, pw) {
  return sgMail.send({
    to: email,
    from: 'dienstplan@lulebe.net',
    subject: 'Passwort zurückgesetzt',
    text: 'Dein neues Dienstplan-Passwort lautet: ' + pw
  })
}