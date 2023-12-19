const { SlashCommandBuilder } = require("discord.js");
const regiserDomain = require("../events/buttons/registerDomain");
const user = require("../models/user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Register a domain."),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: 'true' });
        const data = await user.findOne({ _id: interaction.user.id });
        if (!data) {
            const embed = new EmbedBuilder()
                .setDescription("You are not logged in!")
                .setColor("#0096ff");
            return await interaction.editReply({ embeds: [embed] });
        }
        await regiserDomain(interaction);
    },
};
