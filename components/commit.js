const User = require('../models/user');
const { Octokit } = require("@octokit/rest");
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
    if (type === "A" || type === "MX") {
        data = JSON.stringify(data.split(",").map((s) => s.trim()));
    } else {
        data = `"${data.trim()}"`;
    }
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
    const commit = await octokit.repos.createOrUpdateFileContents({
        owner: username,
        repo: "register",
        path: "domains/" + subdomain.toLowerCase() + ".is-a.dev.json",
        message: `feat(domain): ${subdomain.toLowerCase().replace(/\.[^/.]+$/, "")}.is-a.dev`,
        content: record,
        committer: {
            name: username,
            email: email,
        },
        author: {
            name: username,
            email: email,
        },
    });
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