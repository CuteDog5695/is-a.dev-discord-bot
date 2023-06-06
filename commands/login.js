const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

const auth = require("../components/auth.js");
const User = require("../models/user.js");

module.exports = {
    data: new SlashCommandBuilder().setName("login").setDescription("Login with GitHub."),
    async execute(interaction) {
        if (await User.findOne({ userid: interaction.user.id })) return await interaction.reply({ content: "You are already logged in!", ephemeral: true });

        const authUrl = auth.getAccessToken(interaction.user.id);

        // reply with login button using ButtonBuilder
        const loginBtn = new ActionRowBuilder().addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Login with GitHub").setURL(authUrl));

        await interaction.reply({ components: [loginBtn], ephemeral: true });
    },
};
