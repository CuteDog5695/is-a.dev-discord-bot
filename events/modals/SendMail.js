const Loading = require('../../components/loading');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = async function (interaction) {
    await Loading(interaction, true);
    const to = interaction.fields.getTextInputValue("email");
    const subject = interaction.fields.getTextInputValue("subject");
    const message = interaction.fields.getTextInputValue("message");
    const post = {
        "598245488977903688": "andrew@maintainers.is-a.dev",
        "853158265466257448": "william@maintainers.is-a.dev",
        "757296951925538856": "dibster@maintainers.is-a.dev",
        "914452175839723550": "vaibhav@maintainers.is-a.dev"
    };

    let from = post[interaction.user.id] || "hello@maintainers.is-a.dev";

    const msg = {
        to, // Change to your recipient
        from, // Change to your verified sender
        subject: subject,
        text: message,
        headers: {
          "List-Unsubscribe": `<mailto:unsub@maintainers.is-a.dev?subject=Unsubscribe&body=Unsubscribe%20me%20from%20all%20emails%20from%20is-a.dev%20please.>`
        }
      };
      sgMail.send(msg)
        .then(async (response) => {
          console.log(response[0].statusCode);
          console.log(response[0].headers);
          await interaction.reply({ content: `The following has been sent\n\n${message}`, ephemeral: false });
        })
        .catch(async (error) => {
          console.error(error);
          await interaction.reply({ content: "Email failed to send!", ephemeral: false });
        });
      return;  
}

