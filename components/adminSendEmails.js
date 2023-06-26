const sgMail = require('@sendgrid/mail')
require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const adminemail = process.env.ADMIN_EMAIL
function adminSendEmails(interaction) {
    const email = interaction.fields.getTextInputValue("email");
    const subject = interaction.fields.getTextInputValue("subject");
    const message = interaction.fields.getTextInputValue("message");
    const msg = {
        to: email, // Change to your recipient
        from: adminemail, // Change to your verified sender
        subject: subject,
        text: message,
      }
      sgMail
      .send(msg)
      .then(async (response) => {
        console.log(response[0].statusCode)
        console.log(response[0].headers)
        await interaction.reply({ content: "Email sent!" });
      })
      .catch(async (error) => {
        console.error(error)
        await interaction.reply({ content: "Email failed to send!" });
      })
    
}

exports.adminSendEmails = adminSendEmails;