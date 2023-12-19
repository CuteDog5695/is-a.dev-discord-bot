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
const regiserDomain = require("../events/buttons/registerDomain");
const user = require("../models/user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Register a domain."),
    async execute(interaction) {
        const data = await user.findOne({ _id: interaction.user.id });
        if (!data) {
            // generate uuid string
            const uuid = require("crypto").randomUUID();
            // generate url
            const url = `${domain}/login?uuid=${uuid}`;

            await new auth({
                _id: interaction.user.id,
                uuid: uuid,
                loggedIn: false,
            }).save();

            const embed = new EmbedBuilder()
                .setColor("#0096ff")
                .setDescription("You need to login first before you can register a domain. Click the button below to login with GitHub.");
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Login")
                    .setURL(url),
            );
            await interaction.reply({ embeds: [embed], components: [row] });
            return;
        }
        await regiserDomain(interaction);
    },
};
