const Loading = require('../../components/loading');
const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
module.exports = async function (interaction) {
    const register = new ModalBuilder().setTitle('Register a Domain').setCustomId('regiserDomain')

    const domainCheck = new TextInputBuilder()
        .setCustomId('DomainCheck')
        .setPlaceholder('Enter a subdomain')
        .setMinLength(2)
        .setMaxLength(60)
        .setRequired(true)
        .setLabel('Enter the subdomain you want to register')
        .setStyle("Short");
   

    const row = new ActionRowBuilder().addComponents(domainCheck);
    register.addComponents(row);
    await interaction.showModal(register);

    

}
