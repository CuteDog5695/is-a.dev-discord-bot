const { EmbedBuilder } = require('discord.js');
const Loading = require('../../components/loading');
module.exports = async function (interaction) {
    await Loading(interaction, true);
    const embed = new EmbedBuilder()
        .setTitle("Domain Deletion Cancelled")
        .setDescription("You have cancelled the domain deletion process.")
        .setColor("#0096ff");
    await interaction.editReply({ embeds: [embed] });
}
