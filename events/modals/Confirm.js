const Loading = require('../../components/loading');
const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = async function (interaction) {
    await Loading(interaction, true);
    const rawdomain = interaction.customId.slice(8)
    const domain = rawdomain.slice(0, -3);
    const dtype = rawdomain.substr(-1);
    let type = ""
    switch (dtype) {
        //A Record
        case '1':
            type = "A"
            break;
        //AAAA Record
        case '2':
            type = "AAAA"
            break;
        //CNAME Record
        case '3':
            type = "CNAME"
            break;
        //MX Record
        case '4':
            type = "MX"
            break;
        //TXT Record
        case '5':
            type = "TXT"
            break;
    }
    const content  = interaction.fields.getTextInputValue(`Content`)
    switch (type) {
    case 'A':
        regexPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        break;
    case 'CNAME':
    case 'MX':
        regexPattern = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/;
        break;
    case 'TXT':
        regexPattern = /^.*$/;
        break;
    case 'URL':
        regexPattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.){1,}[a-zA-Z]{2,}(\/[a-zA-Z0-9-_.~:/?#[\]@!$&'()*+,;=%]*)?$/;
        break;
    case 'AAAA':
        regexPattern = /^[a-fA-F0-9]{1,4}(:[a-fA-F0-9]{1,4}){7}$/;
        break;
    default:
        return interaction.editReply("ERROR: The record type you have provided is invalid"); 
}

if (!regexPattern.test(content)) return await interaction.editReply("ERROR: The record data you have provided is invalid");

    const embed = new EmbedBuilder()
        .setTitle('Confirm Domain')
        .setDescription('This is the information you have entered. Please confirm that it is correct. \n\n' + `**Domain:** ${domain}.is-a.dev \n**Type:** ${type} \n**Content:** ${content}`)
        .setColor('#0096ff')
    const confirm = new ButtonBuilder()
        .setCustomId(`confirm-d-${domain}-t-${dtype}-c-${content}`)
        .setLabel("Confirm")
        .setStyle(ButtonStyle.Primary);
    const cancel = new ButtonBuilder()
        .setCustomId(`cancel`)
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Primary);
    const row = new ActionRowBuilder().addComponents(confirm);
    await interaction.editReply({
        components: [row],
        ephemeral: true,
        embeds: [embed]
});
}


