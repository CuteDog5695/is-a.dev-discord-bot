const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const loading = require("../components/loading");
const fetch = require("node-fetch");
const staff = require("../models/staff");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bot")
        .setDescription("Shows bot info"),
    async execute(interaction) {
        await loading(interaction, false)
        // get timestamp of bot online
        const timestamp = new Date(interaction.client.readyTimestamp);
        // get staff count
        const staffCount = await staff.countDocuments();
        const embed = {
            "description": `🟢 **Online Since**: <t:${parseInt(timestamp / 1000)}:R>\n 👮 **Staff members**: ${staffCount}\n `,
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
