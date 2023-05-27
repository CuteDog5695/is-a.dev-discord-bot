const { SlashCommandBuilder } = require('discord.js');
const User = require('../models/user.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('logout')
		.setDescription('Loutout from Github!!'),
	async execute(interaction) {
        if (!interaction.member.roles.cache.some(role => role.name === 'Bot Beta Tester')) {
            await interaction.reply('Only beta testers can use this command!');
            return;
        }
        if (!User.findOne({ userid: interaction.user.id })) {
            await interaction.reply('You are not logged in!');
            return;
        }
        await User.findOneAndDelete({ userid: interaction.user.id });
        await interaction.reply('You have been logged out!');
	},
};