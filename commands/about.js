const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("about").setDescription("About the bot!"),
    async execute(interaction) {
        await interaction.reply("This bot is open source! Check it out at https://github.com/andrewstech/is-a-dev-discord");
    },
};
