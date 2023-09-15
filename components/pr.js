const User = require("../models/user");
const { Octokit } = require("@octokit/rest");

require("dotenv").config();

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

async function OpenPR(id, subdomain, interaction, extra) {
    const githubUser = await User.findOne({ userid: id });
    const token = githubUser.gittoken;
    const username = githubUser.githubid;
    const email = githubUser.email;

    if (process.env.DEBUG) {
        console.log("PR FUNCTION.");
        console.log("id: " + id);
        console.log("token: " + token);
        console.log("username: " + username);
        console.log("email: " + email);
    }

    const octokit = new Octokit({ auth: token });
    let existingPullRequests = await octokit.pulls.list({
        owner: "is-a-dev",
        repo: "register",
        state: "open",
        head: `${username}:main`,
        base: "main",
    });

    if (existingPullRequests.data.length > 0) {
        // Pull request already exists, return an error or handle it accordingly

        const embed = new EmbedBuilder().setTitle(`Registering ${subdomain}.is-a.dev`).addFields({ name: "Forked ", value: "✅", inline: true }, { name: "Commited ", value: "✅", inline: true }, { name: "PR Opened ", value: "❌", inline: true }).setColor("#FF0000").setDescription('A pull request already exists').setFooter({
        text: "is-a.dev",
        icon_url: "https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png",
        });

        await interaction.editReply({ embeds: [embed] });
        return;
    }

    const pr = await octokit.pulls.create({
        owner: "is-a-dev",
        repo: "register",
        title: `BETA: Register ${subdomain.toLowerCase().replace(/\.[^/.]+$/, "")}.is-a.dev`,
        head: `${username}:main`,
        base: "main",
        body: `Added \`${subdomain.toLowerCase().replace(/\.[^/.]+$/, "")}.is-a.dev\` using the Discord bot.`,
    });

    const PrUrl = pr.data.html_url;

    const embed = new EmbedBuilder().setTitle(`Registering ${subdomain}.is-a.dev`).addFields({ name: "Forked ", value: "✅", inline: true }, { name: "Commited ", value: "✅", inline: true }, { name: "PR Opened ", value: "✅", inline: true }).setColor("#00b0f4").setDescription('Your domain has been generated! Please wait for a staff member to review your PR.').setFooter({
        text: "is-a.dev",
        icon_url: "https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png",
    });

    await interaction.editReply({ embeds: [embed] });

    if (extra) {
        const PrBtn = new ActionRowBuilder().addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Pull Request").setURL(PrUrl), new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(extra.label).setURL(extra.url));
        await interaction.editReply({ components: [PrBtn] });
    } else {
        const PrBtn = new ActionRowBuilder().addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Pull Request").setURL(PrUrl));
        await interaction.editReply({ components: [PrBtn] });
    }
    return pr;
}

exports.OpenPR = OpenPR;
