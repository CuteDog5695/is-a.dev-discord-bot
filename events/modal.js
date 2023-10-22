const RegisterDomain = require('./modals/RegisterDomain');
module.exports = async function (interaction) {
    if (interaction.customId === "regiserDomain") {
        await RegisterDomain(interaction);
    }
}
