const User = require('../models/user');
const { Octokit } = require("@octokit/core");
require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, Client } = require("discord.js");
async function CommitChanges(id, subdomain, type, data, interaction) {
    const githubUser = await User.findOne({ userid: id });
    const token = githubUser.gittoken;
    const username = githubUser.githubid;
    const email = githubUser.email;
    if (process.env.DEBUG) {
        console.log('COMMIT FUNCTION.');
        console.log('id: ' + id);
        console.log('token: ' + token);
        console.log('username: ' + username);
        console.log('email: ' + email);
    }
    const octokit = new Octokit({
        auth: token
    })

    content = `{
        "owner": {
           "username": "${username}",
           "email": "${email}"
       },
       "record": {
           "${type}": ${data.toLowerCase()}
       }
   }
   `
    const record = Buffer.from(content).toString('base64');
    const commit = octokit.request('POST /repos/{owner}/{repo}/contents/records/{path}', {
        owner: username,
        repo: 'register',
        path: `${subdomain}.json`,
        message: `Add ${type} record for ${subdomain}`,
        content: record,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    const embed = new EmbedBuilder()
    .setTitle(`Registering ${subdomain}.is-a.dev`)
    .addFields(
        { name: 'Forked ', value: '✅', inline: true },
        { name: 'Commited ', value: '✅', inline: true },
        { name: 'PR Opened ', value: '❌', inline: true },
    )
    .setColor('#00b0f4')
    .setFooter({
        text: 'is-a.dev',
        icon_url: 'https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png'
    });
    await interaction.editReply({ embeds: [embed] });
    return commit;
}
exports.CommitChanges = CommitChanges;