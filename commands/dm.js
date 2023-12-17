const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const loading = require("../components/loading");
const staff = require("../models/staff");
const DmUser = require("../components/DmUser");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dm")
        .setDescription("DM a user [Staff Only]")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("User to DM")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("message")
                .setDescription("Message to DM")
                .setRequired(true)
        ),
    async execute(interaction) {
        await loading(interaction, true);
        const data = await staff.findOne({ _id: interaction.user.id });
        if (!data) {
            const embed = new EmbedBuilder()
                .setDescription("You are not staff!")
                .setColor("#0096ff");
            return await interaction.editReply({ embeds: [embed] });
        }
        let user = interaction.options.getUser("user");
        user = interaction.guild.members.cache.get(user.id);
        const message = interaction.options.getString("message");
        const embed = new EmbedBuilder()
            .setTitle("DM")
            .setDescription(message)
            .setColor("#0096ff");

        await DmUser(interaction.client, user, embed);

        const embed2 = new EmbedBuilder()
            .setDescription("DM Sent!")
            .setColor("#0096ff");
        await interaction.editReply({ embeds: [embed2] });
    }
};
        
        
