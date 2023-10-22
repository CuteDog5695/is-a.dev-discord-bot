const user = require('../models/user');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { Octokit } = require('@octokit/rest');
module.exports = async function (interaction, title, description) {
    try {
        const data = await user.findOne({ _id: interaction.user.id });
        let token = data.githubAccessToken;
        let username = data.githubUsername;

        const octokit = new Octokit({
            auth: token,
        });

        let existingPullRequests = await octokit.pulls.list({
            owner: "is-a-dev",
            repo: "register",
            state: "open",
            head: `${username}:main`,
            base: "main",
        });

        if (existingPullRequests.data.length > 0) {

            // get html link
            let htmlLink = existingPullRequests.data[0].html_url;
            const existingEmbed = new EmbedBuilder()
                .setTitle("You already have a PR open!")
                .setDescription("You already have a PR open, We have added your changes to the existing PR.")
                .setColor("#0096ff");

            const existingButton = new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel("View PR")
                .setURL(htmlLink);

            const existingActionRow = new ActionRowBuilder()
                .addComponents(existingButton);

            interaction.editReply({ embeds: [existingEmbed], ephemeral: true, components: [existingActionRow] });
            return;
        }

        const pr = await octokit.pulls.create({
            owner: "is-a-dev",
            repo: "register",
            title: title,
            body: description,
            head: `${username}:main`,
            base: "main",
        });

        const PrUrl = pr.data.html_url;

        const embed = new EmbedBuilder()
            .setTitle("PR Opened")
            .setDescription("Your PR has been opened! Please wait for a staff member to review it.")
            .setColor("#0096ff");

        const PrBtn = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel("Pull Request")
                .setURL(PrUrl),
        );

        await interaction.editReply({ embeds: [embed], components: [PrBtn] });
    } catch (error) {
        console.error(error);
        await interaction.editReply({ content: "An error occurred while opening the PR. Please try again later.", ephemeral: true });
    }
}