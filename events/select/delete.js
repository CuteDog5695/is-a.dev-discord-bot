const user = require("../../models/user");
const loading = require('../../components/loading');
const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = async function (interaction) {
    await loading(interaction, true);
    const domain = interaction.values[0];
    const data = await user.findOne({ _id: interaction.user.id });
    if (!data) {
        const embed = new EmbedBuilder()
            .setDescription("You are not logged in!")
            .setColor("#0096ff");
        return await interaction.editReply({ embeds: [embed] });
    }
    const ConfirmButton = new ButtonBuilder()
        .setCustomId(`del-${domain}`)
        .setLabel("Confirm Delete")
        .setStyle(ButtonStyle.Danger);

    const CancelButton = new ButtonBuilder()
        .setCustomId(`cancel-del`)
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Primary);   
        
    const row = new ActionRowBuilder().addComponents(ConfirmButton, CancelButton);
    
    const embed = new EmbedBuilder()
        .setDescription(`Are you sure you want to delete ${domain}?`)
        .setColor("#0096ff");

    await interaction.editReply({
        components: [row],
        ephemeral: true,
        embeds: [embed]
    });
}
