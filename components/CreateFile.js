const { Octokit } = require("@octokit/rest");
const user = require("../models/user");
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
module.exports = async function (type, Ddata, domain, interaction) {
    try {
        const data = await user.findOne({ _id: interaction.user.id });
        let token = data.githubAccessToken;
        let username = data.githubUsername;
        let email = data.email;
        let subdomain = domain;
        let id = interaction.user.id;

        const octokit = new Octokit({
            auth: token,
        });
        // create the file
        if (type === "A" || type === "MX") {
            Ddata = JSON.stringify(Ddata.split(",").map((s) => s.trim()));
        } else {
            Ddata = `"${Ddata.trim()}"`;
        }
        const ifexistsurl = `https://raw.githubusercontent.com/${username}/register/main/domains/${subdomain}.json`;
        const ifexists = await fetch(ifexistsurl);
        //console.log(ifexistsurl);
        //console.log(ifexists.status);

        if (ifexists.status === 200) {
            const sadEmbed = new EmbedBuilder()
                .setDescription("Error: a file with that name already exists!")
                .setColor("#0096ff");

            const sadButton = new ButtonBuilder()
                // Link to the file
                .setLabel("View File")
                .setStyle(ButtonStyle.Link)
                .setURL(ifexistsurl);

            const sadrow = new ActionRowBuilder().addComponents(sadButton);
            await interaction.editReply({
                components: [sadrow],
                ephemeral: true,
                embeds: [sadEmbed]
            });
            return;
        }
        content = `{
        "owner": {
           "username": "${username}",
           "email": "",
           "discord": "${id}"
        },
    
        "record": {
            "${type}": ${Ddata.toLowerCase()}
        }
    }
    `;

        const record = Buffer.from(content).toString("base64");

        const commit = await octokit.repos.createOrUpdateFileContents({
            owner: username,
            repo: "register",
            path: "domains/" + subdomain.toLowerCase() + ".json",
            message: `Register ${subdomain}.is-a.dev`,
            content: record,
        });
        return true;
    } catch (error) {
        const sadEmbed = new EmbedBuilder()
            .setDescription("Something went wrong while committing the file!")
            .setColor("#0096ff");
        await interaction.editReply({
            embeds: [sadEmbed],
            ephemeral: true,
        });
        console.error(error);
        return false;

    }
};
    


    
