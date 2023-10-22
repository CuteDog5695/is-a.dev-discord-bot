const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const loading = require("../components/loading");
const auth = require("../models/auth");
const user = require("../models/user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("logout")
        .setDescription("Logout of GitHub."),
    async execute(interaction) {
        // Send loading embed
        await loading(interaction, true);

        const data = await auth.findOne({ _id: interaction.user.id });
        if (data) {
            await auth.deleteOne({ _id: interaction.user.id });
            await user.deleteOne({ _id: interaction.user.id });

            const embed = new EmbedBuilder()
                .setDescription("You have been logged out!")
                .setColor("#0096ff");

            await interaction.editReply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setDescription("You are not logged in!")
                .setColor("#0096ff");

            await interaction.editReply({ embeds: [embed] });
        }
    },
};
