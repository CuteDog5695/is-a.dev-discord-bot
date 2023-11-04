const RegisterDomain = require('./modals/RegisterDomain');
const Confirm = require('./modals/Confirm');
const SendEmail = require('./modals/SendMail');
module.exports = async function (interaction) {
    if (interaction.customId === "regiserDomain") {
        await RegisterDomain(interaction);
    }
    if (interaction.customId.startsWith("Content-")) {
        await Confirm(interaction);
    }
    if (interaction.customId === "sendemail") {
        await SendEmail(interaction);
    }
}
