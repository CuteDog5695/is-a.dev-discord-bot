const { EmbedBuilder } = require("discord.js");

module.exports = async function (interaction, ephemeral) {
    await interaction.deferReply({ ephemeral: ephemeral });

    const embed = new EmbedBuilder()
        .setColor("#0096ff")
        .setDescription(`<a:ping:1165611648325791826> Loading...`);

    return await interaction.editReply({ embeds: [embed] });
};
