const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const User = require('../models/user.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('domains')
		.setDescription('Lists all domains registered by you!'),
	async execute(interaction) {
        if (!interaction.member.roles.cache.some(role => role.name === 'Bot Beta Tester')) {
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
        .then(response => response.json())
        .then(async data => {
          let found = false;
          let results = [];

          for (let i = 0; i < data.length; i++) {
            if (data[i].owner.username.toLowerCase() === username.toLowerCase()) {
              results.push(data[i].domain);
              found = true;
            }
          }

          if (found) {
            let count = results.length;
            let embed = new EmbedBuilder()
              .setAuthor({
                name: "Is a dev BOT",
                url: "https://is-a.dev",
                iconURL: "https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png",
              })
              .setDescription("You own ``" + count + "`` domains")
              .addFields(
                {
                  name: "Your Domains",
                  value: ` ${results.join('\n')} `,
                },
              )
              .setColor("#00b0f4")
              .setFooter({
                text: "©IS-A-DEV",
                iconURL: "https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png",
              });

            await interaction.reply({ embeds: [embed] });
          } else {
            await interaction.reply("You don't own any domains");
            }
        })

        

	},
};