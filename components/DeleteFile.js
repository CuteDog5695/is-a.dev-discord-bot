const user = require("../models/user");
const { Octokit } = require("@octokit/rest");
const { EmbedBuilder } = require("discord.js");
module.exports = async function (interaction, domain) {
    try {
        const data = await user.findOne({ _id: interaction.user.id });
        let token = data.githubAccessToken;
        let username = data.githubUsername;
        // remove .is-a.dev from the domain
        domain = domain.replace(".is-a.dev", "");
        const file = await fetch(
            `https://api.github.com/repos/${username}/register/contents/domains/${domain}.json`,
        )
            .then((res) => res.json())
            .catch((err) => {
                console.log(err);
            });
        console.log(file);
        console.log(username);
        console.log(domain);
        // get the sha var from the json
        const sha = file.sha;
        const octokit = new Octokit({
            auth: token,
        });
        const deletefile = await octokit.repos.deleteFile({
            owner: username,
            repo: "register",
            path: `domains/${domain}.json`,
            message: `Delete ${domain}.is-a.dev`,
            sha: sha,
        });
        if (deletefile.status === 200) {
            return true;
        } else {
            const sadEmbed = new EmbedBuilder()
                .setDescription("Something went wrong while deleting the file!")
                .setColor("#0096ff");
            await interaction.editReply({
                embeds: [sadEmbed],
                ephemeral: true,
            });
            return false;
        }
    } catch (error) {
        console.log(error);
        const sadEmbed = new EmbedBuilder()
                .setDescription("Something went wrong while deleting the file!")
                .setColor("#0096ff");
            await interaction.editReply({
                embeds: [sadEmbed],
                ephemeral: true,
            });
        return false;
    }
}

