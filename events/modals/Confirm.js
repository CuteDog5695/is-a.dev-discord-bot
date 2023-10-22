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
    const embed = new EmbedBuilder()
        .setTitle('Confirm Domain')
        .setDescription('This is the information you have entered. Please confirm that it is correct. \n\n' + `**Domain:** ${domain}.is-a.dev \n**Type:** ${type} \n**Content:** ${content}`)
        .setColor('#0096ff')
    const confirm = new ButtonBuilder()
        .setCustomId(`confirm-${domain}`)
        .setLabel("Confirm")
        .setStyle(ButtonStyle.Primary);
    const cancel = new ButtonBuilder()
        .setCustomId(`cancel-${domain}`)
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Primary);
    const row = new ActionRowBuilder().addComponents(confirm, cancel);
    await interaction.editReply({
        components: [row],
        ephemeral: true,
        embeds: [embed]
});
}


