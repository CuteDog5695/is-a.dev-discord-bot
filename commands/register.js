const { SlashCommandBuilder, EmbedBuilder, Client } = require("discord.js");
const { fork } = require("../components/fork.js");
const { CommitChanges } = require("../components/commit.js");
const User = require("../models/user.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Register an Is-A-Dev Subdomain!")
        .addStringOption(option =>
            option.setName("subdomain")
                .setDescription("Enter the subdomain")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("record_type")
                .setDescription("Select the record type")
                .setRequired(true)
                .addChoices(
                    { name: 'CNAME', value: 'CNAME' },
                    { name: 'A', value: 'A' },
                    { name: 'TXT', value: 'TXT' },
                ))
        .addStringOption(option =>
            option.setName("record_string")
                .setDescription("Enter the record string")
                .setRequired(true)
        ),
    async execute(interaction) {
        const subdomain = interaction.options.getString("subdomain");
        const recordType = interaction.options.getString("record_type");
        const recordString = interaction.options.getString("record_string");

        if (!interaction.member.roles.cache.some((role) => role.name === "Bot Beta Tester")) {
            await interaction.reply("Only beta testers can use this command!");
            return;
        }

        const githubUser = await User.findOne({ userid: interaction.user.id });

        if (!githubUser) {
            await interaction.reply("You are not logged in!");
            return;
        }

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
                await interaction.reply("Invalid record type.");
                return;
        }

        if (!regexPattern.test(recordString)) {
            await interaction.reply("Invalid record string.");
            return;
        }
        // embed
        const embed = new EmbedBuilder()
        .setTitle(`Registering ${subdomain}.is-a.dev`)
        .addFields(
            { name: 'Forked', value: '❌' },
            { name: 'Commited', value: '❌' },
            { name: 'PR Opened', value: '❌' },
        )
        .setColor('#00b0f4')
        .setFooter({
            text: 'is-a.dev',
            icon_url: 'https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png'
        });
        await interaction.reply({ embeds: [embed] });
        await fork(interaction.user.id, interaction, subdomain)
        await CommitChanges(interaction.user.id, subdomain, recordType, recordString, interaction);
    },
};
