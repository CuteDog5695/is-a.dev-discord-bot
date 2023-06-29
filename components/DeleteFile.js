const { Octokit } = require("@octokit/rest");
const User = require("../models/user");
const { EmbedBuilder } = require("discord.js");
async function DeleteFile(domain, interaction) {
    const id = interaction.user.id;
    const githubUser = await User.findOne({ userid: id });
    const token = githubUser.gittoken;
    const octokit = new Octokit({ auth: token });
    // get the file sha
    const file = await octokit.repos.getContent({
        owner: githubUser.githubid,
        repo: "register",
        path: `domains/${domain}.json`,
    });
    const sha = file.data.sha;
    const deletefile = await octokit.repos.deleteFile({
        owner: githubUser.githubid,
        repo: "register",
        path: `domains/${domain}.json`,
        message: `Delete ${domain}.is-a.dev`,
        sha: sha,
    });
    const embed = new EmbedBuilder().setTitle(`Deleting ${subdomain}.is-a.dev`).addFields({ name: "Forked", value: "✅", inline: true }, { name: "Commited", value: "✅", inline: true }, { name: "PR Opened", value: "❌", inline: true }).setDescription(`Please wait for a staff member to review your PR.`).setColor("#00b0f4").setFooter({
        text: "is-a.dev",
        icon_url: "https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png",
    });

    await interaction.editReply({ embeds: [embed] });

}

exports.DeleteFile = DeleteFile;