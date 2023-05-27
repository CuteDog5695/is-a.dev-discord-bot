const { Events, ModalBuilder, SlashCommandBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const fetch = require('node-fetch');
const User = require('../models/user.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Delete a domain!!'),
  async execute(interaction) {
    if (
      !interaction.member.roles.cache.some(
        (role) => role.name === 'Bot Beta Tester'
      )
    ) {
      await interaction.reply('Only beta testers can use this command!');
      return;
    }
    const githubUser = await User.findOne({ userid: interaction.user.id });
    console.log(githubUser);
    if (!githubUser) {
      await interaction.reply('You are not logged in!');
      return;
    }
    const username = githubUser.githubid;
    fetch('https://raw.is-a.dev')
      .then((response) => response.json())
      .then(async (data) => {
        let found = false;
        let results = [];
        for (let i = 0; i < data.length; i++) {
          if (
            data[i].owner.username.toLowerCase() === username.toLowerCase()
          ) {
            results.push({
              label: data[i].domain,
              value: data[i].domain,
            });
            found = true;
          }
        }
        if (!found) {
          await interaction.reply("You don't own any domains");
          return;
        } else {

          // Create a select menu
          const dropdown = new StringSelectMenuBuilder()
            .setCustomId('delete_select')
            .setPlaceholder('Select a domain')
            .addOptions(results);

            const row = new ActionRowBuilder()
            .addComponents(dropdown);

          // Create the text input components
          await interaction.reply({
            content: 'Choose the domian you want to delete',
            components: [row],
          });
        }
      });
  },
};
