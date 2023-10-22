const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require("discord.js");

const loading = require("../components/loading");

const auth = require("../models/auth");

const domain = process.env.DOMAIN;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("login")
        .setDescription("Login with GitHub"),
    async execute(interaction) {
        // Send loading embed
        await loading(interaction, true);
        // check if user is already logged in
        const data = await auth.findOne({ _id: interaction.user.id });
        if (data) {
            const embed = new EmbedBuilder()
                .setDescription("You are already logged in!")
                .setColor("#0096ff");

            await interaction.editReply({ embeds: [embed] });
            return;
        }
        // generate uuid string
        const uuid = require("crypto").randomUUID();
        // generate url
        const url = `${domain}/login?uuid=${uuid}`;

        await new auth({
            _id: interaction.user.id,
            uuid: uuid,
            loggedIn: false,
        }).save();
        // it needs to be in a row
        const embed = new EmbedBuilder()
            .setColor("#0096ff")
            .setDescription("Click the button below to login with GitHub.");
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel("Login")
                .setURL(url),
        );

        await interaction.editReply({ embeds: [embed], components: [row] });
    },
};
