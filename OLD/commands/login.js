const {
    SlashCommandBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
} = require("discord.js");

const auth = require("../components/auth.js");
const User = require("../models/user.js");
const { GuildID } = require("../services/guildId.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("login")
        .setDescription("Login with GitHub."),
    async execute(interaction) {
        const guildId = interaction.guildId;
        // get the guild object from the guild id
        const guild = GuildID(guildId);
        // if the guild object is false, then the guild is not registered
        if (!guild)
            return await interaction.reply({
                content:
                    "This guild is not registered with Domain Register Bot. Please contact the guild owner to register.",
                ephemeral: true,
            });
        if (await User.findOne({ userid: interaction.user.id }))
            return await interaction.reply({
                content: "You are already logged in!",
                ephemeral: true,
            });

        const authUrl = auth.getAccessToken(interaction.user.id);

        // reply with login button using ButtonBuilder
        const loginBtn = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel("Login with GitHub")
                .setURL(authUrl),
        );

        await interaction.reply({ components: [loginBtn], ephemeral: true });
    },
};
