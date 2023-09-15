const User = require("../models/user");
const { Octokit } = require("@octokit/rest");

require("dotenv").config();

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
async function DeletePR(interaction, subdomain) {
    const id = interaction.user.id;
    const githubUser = await User.findOne({ userid: id });
    const token = githubUser.gittoken;
    const username = githubUser.githubid;
    const email = githubUser.email;
    const octokit = new Octokit({ auth: token });
    const pr = await octokit.pulls.create({
        owner: "is-a-dev",
        repo: "register",
        title: `BETA: Delete ${subdomain}`,
        head: `${username}:main`,
        base: "main",
        body: `Delete ${subdomain} using the Discord bot.`,
    });
    const PrUrl = pr.data.html_url;

    const embed = new EmbedBuilder().setTitle(`Deleteing ${subdomain}`).addFields({ name: "Forked ", value: "✅", inline: true }, { name: "Commited ", value: "✅", inline: true }, { name: "PR Opened ", value: "✅", inline: true }).setColor("#00b0f4").setFooter({
        text: "is-a.dev",
        icon_url: "https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png",
    });

    await interaction.editReply({ embeds: [embed] });
    const PrBtn = new ActionRowBuilder().addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Pull Request").setURL(PrUrl));
    await interaction.editReply({ components: [PrBtn] });
}

module.exports = { DeletePR };