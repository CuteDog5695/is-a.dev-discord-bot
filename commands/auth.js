const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const auth = require('../components/auth.js');
const User = require('../models/user.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('login')
		.setDescription('Login with Github!!'),
	async execute(interaction) {
        if (!interaction.member.roles.cache.some(role => role.name === 'Bot Beta Tester')) {
            await interaction.reply('Only beta testers can use this command!');
            return;
        }
        if (await User.findOne({ userid: interaction.user.id })) {
            await interaction.reply('You are already logged in!');
            return;
        }
        const authUrl = auth.getAccessToken(interaction.user.id);
		
		// reply with login button using ButtonBuilder
        const loginBtn = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setStyle(ButtonStyle.Link)
              .setLabel("Login with GitHub")
              .setURL(authUrl)
          );
      
          await interaction.reply({ components: [loginBtn], ephemeral: true });
	},
};