const bcrypt = require('bcrypt')
const generator = require('generate-password')

const mailer = require.main.require('./email')
const config = require.main.require('./config')
const { User } = require.main.require('./db')

module.exports = async (req, res) => {
  if (!req.body.email)
    return res.redirect('/?status=0')
  const foundUser = await User.findOne({where: {email: req.body.email.toLowerCase()}})
  if (!foundUser)
    return res.redirect('/?status=2')
  const pw = generator.generate({length: 10, numbers: true})
  foundUser.password = await bcrypt.hash(pw, await bcrypt.genSalt(config.SALT_ROUNDS))
  await foundUser.save()
  await sendEmail(foundUser.email, foundUser.fullName, pw)
  res.redirect('/?status=1')
}

function sendEmail (email, name, pw) {
  return mailer(
    email,
    'Passwort zurückgesetzt',
    name,
    'Dein neues Dienstplan-Passwort lautet:<br>' + pw,
    'Dein neues Dienstplan-Passwort lautet:<br><pre>' + pw + '</pre>'
    )
}