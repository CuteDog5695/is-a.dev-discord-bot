const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");


module.exports = {
    data: new SlashCommandBuilder().setName("about").setDescription("About the bot!"),
    async execute(interaction) {
        const uptime = prettyMilliseconds(interaction.client.uptime, { verbose: true, secondsDecimalDigits: 0 });
        const embed = new EmbedBuilder()
            .setTitle("About is-a-dev")
            .setDescription("is-a-dev is a free domain registration service for developers.")
            .addField("Uptime", uptime, true)
            .addField("Users", interaction.client.users.cache.size, true)
            .addField("Source Code", "https://github.com/andrewstech/is-a-dev-discord")
            .setColor("#00b0f4")
            .setFooter({
                text: "is-a.dev",
                iconURL: "https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png",
            });
        await interaction.reply({ embeds: [embed] });
    },
};
