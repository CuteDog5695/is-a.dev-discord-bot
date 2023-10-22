const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const loading = require("../components/loading");
const fetch = require("node-fetch");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bot")
        .setDescription("Shows bot info"),
    async execute(interaction) {
        await loading(interaction, false);
        const Count = await fetch("https://manage.is-a.dev/api/stats").then((res) => res.json());
        const domainCount = Count.subdomains;
        const userCount = Count.individualOwners;
        // get timestamp of bot online
        const timestamp = new Date(interaction.client.readyTimestamp);
        const embed = {
            "description": `🟢 **Online Since**: <t:${parseInt(timestamp / 1000)}:R>\n🌐 **Domains Registered**: ${domainCount}\n👯 **Users**: ${userCount}\n`,
            "fields": [],
            "author": {
              "name": "is-a.dev",
              "url": "https://is-a.dev",
              "icon_url": "https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png"
            },
            "title": "Bot Info",
            "color": 928486
          };
        const button = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel("GitHub")
            .setURL("https://github.com/andrewstech/is-a-dev-discord");
        
        const row = new ActionRowBuilder().addComponents(button);
        await interaction.editReply({ embeds: [embed], components: [row] });    
    },
};
