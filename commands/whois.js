const { SlashCommandBuilder, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const Maintainers = require('../models/maintainers.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('whois')
    .setDescription('Whois lookup!!')
    .addStringOption((option) =>
      option.setName('domain').setDescription('The domain to lookup.').setRequired(true)),

  async execute(interaction) {
    const domain = interaction.options.getString('domain');
    if (!await Maintainers.findOne({ userid: interaction.user.id })) {
        // make text appear in ephemeral message
        await interaction.reply({ content: 'Only maintainers can use this command!', ephemeral: true });
      return;
    }

    try {
      const response = await fetch(`https://raw.githubusercontent.com/is-a-dev/register/main/domains/${domain}.json`, {
        headers: {
          'User-Agent': 'mtgsquad'
        }
      });
      if (response.status === 404) {
        await interaction.reply(`The domain ${domain}.is-a.dev is not registered!`);
      } else {
        const data = await response.json();
        console.log(data);
        const description = data.description;
        const repo = data.repo;
        const owner = data.owner.username;
        const email = data.owner.email;
        const cname = data.record.CNAME;
        const mx = data.record.MX;
        const txt = data.record.TXT;
        const a = data.record.A;
        const fileURL = `https://github.com/is-a-dev/register/blob/main/domains/${domain}.json`;

        const embed = {
            title: `Whois Lookup: ${domain}.is-a.dev`,
            fields: [
            { name: 'Owner', value: owner, inline: true },
            { name: 'Description', value: description, inline: true },
            { name: 'Repository', value: repo, inline: true },
            { name: 'Owner Email', value: email, inline: true },
            { name: 'CNAME', value: cname, inline: true },
            { name: 'MX Record', value: mx || 'Not available', inline: true },
            { name: 'TXT Record', value: txt || 'Not available', inline: true },
            { name: 'A Record', value: a || 'Not available', inline: true },
            { name: 'File URL', value: fileURL, inline: true }
            ],
            color: 0x00FFFF,
            timestamp: new Date(),
            footer: {
                text: 'IS-A-DEV',
                icon_url: 'https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png',
            },
        };


        await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Error performing whois lookup:', error);
      // make text appear in ephemeral message
      await interaction.reply({ content: 'An error occurred while performing the whois lookup. Please try again later.', ephemeral: true });
    }
  },
};
