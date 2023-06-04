const { SlashCommandBuilder, EmbedBuilder, Client, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { fork } = require("../components/fork.js");
const auth = require("../components/auth.js");
const { CommitChanges } = require("../components/commit.js");
const { OpenPR } = require("../components/pr.js");
const User = require("../models/user.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Register an is-a.dev Subdomain!")
        .addStringOption((option) => option.setName("subdomain").setDescription("Enter the subdomain").setRequired(true))
        .addStringOption((option) => option.setName("record_type").setDescription("Select the record type").setRequired(true).addChoices({ name: "A", value: "A" }, { name: "CNAME", value: "CNAME" }, { name: "MX", value: "MX" }, { name: "TXT", value: "TXT" }))
        .addStringOption((option) => option.setName("content").setDescription("Enter the record value(s)").setRequired(true)),
    async execute(interaction) {
        const subdomains = interaction.options.getString("subdomain");
        const recordType = interaction.options.getString("record_type");
        const recordString = interaction.options.getString("content");

        const githubUser = await User.findOne({ userid: interaction.user.id });

        const authUrl = auth.getAccessToken(interaction.user.id);
        const loginBtn = new ActionRowBuilder().addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Login with GitHub").setURL(authUrl));
        // add text reply if user is not logged in. along with login button
        if (!githubUser) return await interaction.reply({ content: `Please login first`, components: [loginBtn], ephemeral: true });

        let regexPattern;

        switch (recordType) {
            case "A":
                regexPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
                break;
            case "CNAME":
                regexPattern = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/;
                break;
            case "MX":
                regexPattern = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/;
                break;
            case "TXT":
                regexPattern = /^.*$/;
                break;
            default:
                return await interaction.reply("Invalid record type.");
        }

        if (!regexPattern.test(recordString)) return await interaction.reply("Invalid record string.");

        // Embed
        const subdomain = subdomains.replace(/\.is-a\.dev$/, "");

        const embed = new EmbedBuilder().setTitle(`Registering ${subdomain}.is-a.dev`).addFields({ name: "Forked", value: "❌", inline: true }, { name: "Commited", value: "❌", inline: true }, { name: "PR Opened", value: "❌", inline: true }).setColor("#00b0f4").setFooter({
            text: "is-a.dev",
            icon_url: "https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png",
        });

        await interaction.reply({ embeds: [embed] });
        await fork(interaction.user.id, interaction, subdomain);

        // add a 3 second delay to allow the fork to complete
        await new Promise((r) => setTimeout(r, 3000));
        await CommitChanges(interaction.user.id, subdomain, recordType, recordString, interaction);
        await OpenPR(interaction.user.id, subdomain, interaction);
    },
};
