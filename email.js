const nodemj = require ('node-mailjet')

const config = require('./config')

const mailjet = nodemj.connect(config.MJ_APIKEY_PUBLIC, config.MJ_APIKEY_PRIVATE)

module.exports = function (users, subject, text, html) {
  const to = users.map(u => ({"Email": u.email, "Name": u.name}))
  return mailjet.post("send", {'version': 'v3.1'}).request({
        "Messages":[{
            "From": {
                "Email": "dienstplan@lulebe.net",
                "Name": "Dienstplan-KKH"
            },
            "To": to,
            "Subject": subject,
            "TextPart": 'Hallo' + (users.length === 1 ? (' ' + user[0].name) : '') + ',\n\n' + text + '\n\nViele Grüße,\ndas Dienstplan-Team',
            "HTMLPart": 'Hallo' + (users.length === 1 ? (' ' + user[0].name) : '') + ',<br><br>' + html + '<br><br>Viele Grüße,<br>das Dienstplan-Team'
        }]
    })
}