const User = require("../models/user");
const { EmbedBuilder } = require("discord.js");
const { Octokit } = require("@octokit/core");
require("dotenv").config();
const Sentry = require("@sentry/node");
const { GuildID } = require("../services/guildId.js");

const forkRepo = async (token, guild) => {
    try {
        // Fork the repository
        const username = guild.github;
        const respository = guild.repository;
        const logo = guild.logo;
        const octokit = new Octokit({
            auth: token,
        });

        const forked = await octokit.request("POST /repos/{owner}/{repo}/forks", {
            owner: username,
            repo: respository,
            name: "register",
            default_branch_only: true,
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });
        const cloneResponse = forked.data.clone_url;
        if (process.env.DEBUG) {
            console.log("FORKED REPO: " + cloneResponse);
        }
        return cloneResponse;
    } catch (error) {
        console.log(error);
    }
};

async function fork(id, interaction, subdomain) {
    const usersguild = interaction.guildId;
    const guild = await GuildID(usersguild);
    const githubUser = await User.findOne({ userid: id });
    const token = githubUser.gittoken;
    Sentry.setUser({ Discord: id });
    if (process.env.DEBUG) {
        console.log("FORK FUNCTION.");
        console.log("id: " + id);
        console.log("token: " + token);
    }
    const responce = await forkRepo(token, guild);
    const embed = new EmbedBuilder().setTitle(`Registering ${subdomain}.is-a.dev`).addFields({ name: "Forked ", value: "✅", inline: true }, { name: "Commited ", value: "❌", inline: true }, { name: "PR Opened ", value: "❌", inline: true }).setColor("#00b0f4").setFooter({
        text: "is-a.dev",
        icon_url: guild.logo,
    });
    await interaction.editReply({ embeds: [embed] });
    return responce;
}
exports.fork = fork;
