const { EmbedBuilder } = require('discord.js');
const user = require("../../models/user");
const loading = require("../../components/loading");
module.exports = async function (interaction) {
    await loading(interaction, true);
    let email = interaction.values[0];
    const data = await user.findOne({ _id: interaction.user.id });
    if (!data) {
        const embed = new EmbedBuilder()
            .setDescription("You are not logged in!")
            .setColor("#0096ff");
        return await interaction.editReply({ embeds: [embed] });
    }
    // update email in db to selected email
    await user.updateOne({ _id: interaction.user.id }, { email: email });
    const embed = new EmbedBuilder()
        .setDescription(`Email has been set to ${email}`)
        .setColor("#0096ff");
    await interaction.editReply({ embeds: [embed] });
}


