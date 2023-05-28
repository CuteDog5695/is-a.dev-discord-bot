const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

const auth = require("../components/auth.js");
const User = require("../models/user.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("login")
        .setDescription("Login with GitHub."),
    async execute(interaction) {
        if (!interaction.member.roles.cache.some((role) => role.name === "Bot Beta Tester")) return await interaction.reply("Only beta testers can use this command!");

        if (await User.findOne({ userid: interaction.user.id })) return await interaction.reply("You are already logged in!");

        const authUrl = auth.getAccessToken(interaction.user.id);

        // reply with login button using ButtonBuilder
        const loginBtn = new ActionRowBuilder().addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Login with GitHub").setURL(authUrl));

        await interaction.reply({ components: [loginBtn], ephemeral: true });
    },
};
