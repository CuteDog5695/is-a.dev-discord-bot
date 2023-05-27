const fetch = require('node-fetch');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('check')
    .setDescription('Check if a domain is available.')
    .addStringOption(option =>
      option.setName('subdomain')
        .setDescription('The subdomain to check.')
        .setRequired(true)),
  async execute(interaction) {
    const subdomain = interaction.options.getString("subdomain");
    if (subdomain.length > 63) {
      await interaction.reply('The subdomain must be 63 characters or less.');
      return;
    }
    try {
      const response = await fetch(`https://api.github.com/repos/is-a-dev/register/contents/domains/${subdomain}.json`, {
        headers: {
          "User-Agent": "mtgsquad"
        }
      });
      if (response.status === 404) {
        await interaction.reply(`The domain ${subdomain}.is-a.dev is not registered!`);
      } else {
        await interaction.reply(`The domain ${subdomain}.is-a.dev is registered!`);
      }
    } catch (error) {
      console.error('Error occurred while checking domain availability:', error);
      await interaction.reply('An error occurred while checking the domain availability. Please try again later.');
    }
  },
};
