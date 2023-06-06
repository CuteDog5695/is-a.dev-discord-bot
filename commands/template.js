const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const User = require("../models/user.js");
const { ForwardMailModal } = require("../templates/forwardmail/modal.js");
const { EmailGithub } = require("../templates/forwardmail-github/modal.js");
const auth = require("../components/auth.js");
const { GuildID } = require("../services/guildId.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("template")
        .setDescription("Premade domain templates!")
        .addStringOption((option) => option.setName("templates").setDescription("Select a template").setRequired(true).addChoices({ name: "Email Forwarder", value: "email-forwarder" }, { name: "GitHub Pages and Email Forwarder", value: "github-pages-email-forwarder" })),
    async execute(interaction) {
        const guildId = interaction.guildId;
        // get the guild object from the guild id
        const guild = GuildID(guildId);
        // if the guild object is false, then the guild is not registered
        if (!guild) return await interaction.reply({ content: "This guild is not registered with Domain Register Bot. Please contact the guild owner to register.", ephemeral: true });

        const githubUser = await User.findOne({ userid: interaction.user.id });

        const authUrl = auth.getAccessToken(interaction.user.id);
        const loginBtn = new ActionRowBuilder().addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Login with GitHub").setURL(authUrl));

        // add text reply if user is not logged in. along with login button
        if (!githubUser) return await interaction.reply({ content: `Please login first`, components: [loginBtn], ephemeral: true });

        const template = interaction.options.getString("templates");

        switch (template) {
            case "email-forwarder":
                await ForwardMailModal(interaction);
                break;
            case "github-pages-email-forwarder":
                await EmailGithub(interaction);
                break;
            default:
                return await interaction.reply("Invalid template.");
        }
    },
};
