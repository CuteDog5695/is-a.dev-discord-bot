const User = require("../../models/user.js");
const { fork } = require("../../components/fork.js");
const { OpenPR } = require("../../components/pr.js");
const { Octokit } = require("@octokit/rest");
const { EmbedBuilder } = require("discord.js");

async function HashnodeGen(interaction) {
    const subdomain = interaction.fields.getTextInputValue("subdomain");

    const embeds = new EmbedBuilder()
        .setTitle(`Registering ${subdomain}.is-a.dev`)
        .addFields(
            { name: "Forked", value: "❌", inline: true },
            { name: "Commited", value: "❌", inline: true },
            { name: "PR Opened", value: "❌", inline: true },
        )
        .setColor("#00b0f4")
        .setFooter({
            text: "is-a.dev",
            icon_url:
                "https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png",
        });

    await interaction.reply({ embeds: [embeds] });
    await fork(interaction.user.id, interaction, subdomain);

    const githubUser = await User.findOne({ userid: interaction.user.id });
    const token = githubUser.gittoken;
    const username = githubUser.githubid;
    const email = githubUser.email;
    const id = interaction.user.id;
    const octokit = new Octokit({ auth: token });

    content = `{
    "owner": {
        "username": "${username}",
        "email": "${email}",
        "note": "This record was created by is-a.dev Discord bot via discord id: ${id}"
    },

    "record": {
        "CNAME": "hashnode.network"

    }
}
`;
    // add a 3 second delay to allow the fork to complete
    await new Promise((r) => setTimeout(r, 3000));

    const ifexistsurl = `https://raw.githubusercontent.com/${username}/register/main/domains/${subdomain}.json`;
    const ifexists = await fetch(ifexistsurl);

    if (ifexists.status === 200) {
        const ErrorEmbed = new EmbedBuilder()
            .setTitle(`Registering ${subdomain}.is-a.dev`)
            .setURL(ifexistsurl)
            .setDescription(`This domain already exists!`)
            .addFields(
                { name: "Forked", value: "✅", inline: true },
                { name: "Commited", value: "❌", inline: true },
                { name: "PR Opened", value: "❌", inline: true },
            )
            .setColor("#FF0000")
            .setFooter({
                text: "is-a.dev",
                iconURL:
                    "https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png",
            });

        await interaction.editReply({ embeds: [ErrorEmbed] });
        return;
    } else {
        const record = Buffer.from(content).toString("base64");

        const commit = await octokit.repos.createOrUpdateFileContents({
            owner: username,
            repo: "register",
            path: `domains/${subdomain.toLowerCase()}.json`,
            message: `feat(domain): ${subdomain}.is-a.dev`,
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

        if (process.env.DEBUG) {
            console.log(commit);
        }

        const embed = new EmbedBuilder()
            .setTitle(`Registering ${subdomain}.is-a.dev`)
            .addFields(
                { name: "Forked", value: "✅", inline: true },
                { name: "Commited", value: "✅", inline: true },
                { name: "PR Opened", value: "❌", inline: true },
            )
            .setDescription(
                `Your domain has been generated! Please wait for a staff member to review your PR.`,
            )
            .setColor("#00b0f4")
            .setFooter({
                text: "is-a.dev",
                icon_url:
                    "https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png",
            });

        await interaction.editReply({ embeds: [embed] });
        let extra = {
            label: "Info",
            url: `https://support.hashnode.com/en/articles/5755362-how-to-map-a-custom-domain`,
        };

        await OpenPR(interaction.user.id, subdomain, interaction, extra);
    }
}

exports.HashnodeGen = HashnodeGen;
