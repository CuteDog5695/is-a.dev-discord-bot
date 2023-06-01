const { SlashCommandBuilder } = require("discord.js");
const User = require("../models/user.js");

module.exports = {
    data: new SlashCommandBuilder().setName("logout").setDescription("Logout from the bot."),
    async execute(interaction) {
        if (!interaction.member.roles.cache.some((role) => role.name === "Bot Beta Tester")) return await interaction.reply("Only beta testers can use this command!");

        if (! await User.findOne({ userid: interaction.user.id })) return await interaction.reply("You are not logged in!");

        await User.findOneAndDelete({ userid: interaction.user.id });
        await interaction.reply("You have been logged out!");
    },
};
