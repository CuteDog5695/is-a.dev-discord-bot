const User = require("../../models/user.js");
const { fork } = require("../../components/fork.js");
const { OpenPR } = require("../../components/pr.js");
const { Octokit } = require("@octokit/rest");
const { SlashCommandBuilder, EmbedBuilder, Client } = require("discord.js");
async function ForwardMailGen(interaction) {
    const ForwardEmail = interaction.fields.getTextInputValue('emailaddress');
    const subdomain = interaction.fields.getTextInputValue('subdomain');
    const embeds = new EmbedBuilder().setTitle(`Registering ${subdomain}.is-a.dev`).addFields({ name: "Forked", value: "❌", inline: true }, { name: "Commited", value: "❌", inline: true }, { name: "PR Opened", value: "❌", inline: true }).setColor("#00b0f4").setFooter({
        text: "is-a.dev",
        icon_url: "https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png",
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
            "MX": ["mx1.forwardemail.net", "mx2.forwardemail.net"],
            "TXT": "forward-email=${ForwardEmail}",

       }
    }
    `;
    // add a 3 second delay to allow the fork to complete
    await new Promise((r) => setTimeout(r, 3000));
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
            { name: "PR Opened", value: "❌", inline: true }
        )
        .setDescription(`Your domain has been generated! Please wait for a staff member to review your PR.`)
        .setColor("#00b0f4")
        .setFooter({
            text: "is-a.dev",
            icon_url:
                "https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png",
        });

    await interaction.editReply({ embeds: [embed] });
    await OpenPR(interaction.user.id, subdomain, interaction);

}

exports.ForwardMailGen = ForwardMailGen;