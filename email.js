const nodemj = require ('node-mailjet')

const config = require('./config')

const mailjet = nodemj.connect(config.MJ_APIKEY_PUBLIC, config.MJ_APIKEY_PRIVATE)

module.exports = function (email, subject, name, text, html) {
  return mailjet.post("send", {'version': 'v3.1'}).request({
        "Messages":[{
            "From": {
                "Email": "dienstplan@lulebe.net",
                "Name": "Dienstplan-KKH"
            },
            "To": [{
                "Email": email,
                "Name": name
            }],
            "Subject": subject,
            "TextPart": 'Hallo ' + name + ',\n\n' + text + '\n\nViele Grüße,\ndas Dienstplan-Team',
            "HTMLPart": 'Hallo ' + name + ',<br><br>' + html + '<br><br>Viele Grüße,<br>das Dienstplan-Team'
        }]
    })
}