const user = require('../models/user');
const { EmbedBuilder } = require("discord.js");
const { Octokit } = require("@octokit/rest");
module.exports = async function (interaction) {
    const User = await user.findOne({ id: interaction.user.id });
    const octokit = new Octokit({
        auth: User.githubAccessToken,
    });
    // fork the repo
    const fork = await octokit.repos.createFork({
        owner: "is-a-dev",
        repo: "register",
    });
    if (!fork.status === 202) {
        const sadEmbed = new EmbedBuilder()
            .setDescription("Something went wrong while forking the repo!")
            .setColor("#0096ff");
        return await interaction.editReply({
            embeds: [sadEmbed],
            ephemeral: true,
        });
    }
}


    