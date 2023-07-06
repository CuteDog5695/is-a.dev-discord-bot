const User = require("../models/user");
const { Octokit } = require("@octokit/rest");
const { OpenPR } = require("../components/pr.js");

require("dotenv").config();

const { EmbedBuilder } = require("discord.js");

async function CommitChanges(id, subdomain, type, data, interaction) {
    let pass = "fail";
    const githubUser = await User.findOne({ userid: id });
    const token = githubUser.gittoken;
    const username = githubUser.githubid;
    const email = githubUser.email;

    if (process.env.DEBUG) {
        console.log("COMMIT FUNCTION.");
        console.log("id: " + id);
        console.log("token: " + token);
        console.log("username: " + username);
        console.log("email: " + email);
    }

    const octokit = new Octokit({ auth: token });

    if (type === "A" || type === "MX") {
        data = JSON.stringify(data.split(",").map((s) => s.trim()));
    } else {
        data = `"${data.trim()}"`;
    }

    const ifexistsurl = `https://raw.githubusercontent.com/${username}/register/main/domains/${subdomain}.json`;
    const ifexists = await fetch(ifexistsurl);
    console.log(ifexistsurl);
    console.log(ifexists.status);

    if (ifexists.status === 200) {
        const ErrorEmbed = new EmbedBuilder().setTitle(`Registering ${subdomain}.is-a.dev`).setURL(ifexistsurl).setDescription(`This domain already exists!`).addFields({ name: "Forked", value: "✅", inline: true }, { name: "Commited", value: "❌", inline: true }, { name: "PR Opened", value: "❌", inline: true }).setColor("#FF0000").setFooter({
            text: "is-a.dev",
            iconURL: "https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png",
        });

        await interaction.editReply({ embeds: [ErrorEmbed] });
        return;
    }

    content = `{
    "owner": {
       "username": "${username}",
       "email": "${email}",
       "discord": "${id}"
    },

    "record": {
        "${type}": ${data.toLowerCase()}
    }
}
`;

    const record = Buffer.from(content).toString("base64");

    const commit = await octokit.repos.createOrUpdateFileContents({
        owner: username,
        repo: "register",
        path: "domains/" + subdomain.toLowerCase() + ".json",
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

    const embed = new EmbedBuilder().setTitle(`Registering ${subdomain}.is-a.dev`).addFields({ name: "Forked", value: "✅", inline: true }, { name: "Commited", value: "✅", inline: true }, { name: "PR Opened", value: "❌", inline: true }).setDescription(`Your domain has been generated! Please wait for a staff member to review your PR.`).setColor("#00b0f4").setFooter({
        text: "is-a.dev",
        icon_url: "https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png",
    });

    await interaction.editReply({ embeds: [embed] });
    pass = "true";
    await OpenPR(interaction.user.id, subdomain, interaction);
    return pass;
}

exports.CommitChanges = CommitChanges;
