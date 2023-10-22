const user = require('../models/user');
const { EmbedBuilder } = require("discord.js");
const { Octokit } = require("@octokit/rest");
module.exports = async function(interaction) {
    try {
        const data = await user.findOne({ _id: interaction.user.id });
        let token = data.githubAccessToken;
        
        const octokit = new Octokit({
            auth: token,
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
    } catch (error) {
        console.error(error);
        const sadEmbed = new EmbedBuilder()
            .setDescription("Something went wrong while forking the repo!")
            .setColor("#0096ff");
        return await interaction.editReply({
            embeds: [sadEmbed],
            ephemeral: true,
        });
    }
}


    