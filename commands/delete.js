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
          const modal = new ModalBuilder()
            .setCustomId('delete_modal')
            .setTitle('Delete a domain');

          // Create a select menu
          const dropdown = new StringSelectMenuBuilder()
            .setCustomId('delete_select')
            .setPlaceholder('Select a domain')
            .addOptions(results);

          // Add the select menu to the modal
        
          // Add components to modal

          // Create the text input components
          const favoriteColorInput = new TextInputBuilder()
            .setCustomId('favoriteColorInput')
              // The label is the prompt the user sees for this input
            .setLabel("What's your favorite color?")
              // Short means only a single line of text
            .setStyle(TextInputStyle.Short);

          const hobbiesInput = new TextInputBuilder()
            .setCustomId('hobbiesInput')
            .setLabel("What's some of your favorite hobbies?")
              // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph);

          const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
          const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);
          const thirdActionRow = new ActionRowBuilder().addComponents(dropdown);
          modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

          // Open the modal
          await interaction.showModal(modal);
        }
      });
  },
};
