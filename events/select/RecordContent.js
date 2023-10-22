const Loading = require('../../components/loading');
const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
module.exports = async function (interaction) {
    const type = interaction.values[0];
    let typeNum = 0;
    switch (type) {
        //A Record
        case 'A':
            typeNum = 1;
            break;
        //AAAA Record
        case 'AAAA':
            typeNum = 2;
            break;
        //CNAME Record
        case 'CNAME':
            typeNum = 3;
            break;
        //MX Record
        case 'MX':
            typeNum = 4;
            break;
        //TXT Record
        case 'TXT':
            typeNum = 5;
            break;
    }

    const domain = interaction.customId.slice(5);
    const register = new ModalBuilder().setTitle('Register a Domain').setCustomId(`Content-${domain}-t${typeNum}`)
    const content = new TextInputBuilder()
        .setCustomId(`Content`)
        .setPlaceholder('Enter the content')
        .setMinLength(1)
        .setMaxLength(100)
        .setRequired(true)
        .setLabel('Enter the content for the record. ')
        .setStyle("Short");

    const row = new ActionRowBuilder().addComponents(content);
    register.addComponents(row);
    await interaction.showModal(register);

}
