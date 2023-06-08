const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");


module.exports = {
    data: new SlashCommandBuilder().setName("about").setDescription("About the bot!"),
    async execute(interaction) {
        const uptime = prettyMilliseconds(interaction.client.uptime, { verbose: true, secondsDecimalDigits: 0 });
        // Create embed
        const embed = `{
            "id": 538289175,
            "fields": [
              {
                "id": 449247638,
                "name": "Uptime",
                "value": "${uptime}",
                "inline": false
              }
            ],
            "author": {
              "name": "Domain Registration Bot"
            },
            "title": "About",
            "footer": {
              "text": "©PixelsLTD"
            },
            "color": 16762624
          }`
        await interaction.reply({ embeds: [embed] });
    },
};
