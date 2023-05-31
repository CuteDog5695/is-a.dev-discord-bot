const { SlashCommandBuilder, EmbedBuilder, Client } = require("discord.js");
const { fork } = require("../components/fork.js");

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
        const RedCross = Client.emojis.cache.find(emoji => emoji.name === "redcross");
        const embed = new EmbedBuilder()
        .setTitle(`Registering ${subdomain}.is-a.dev`)
        .setDescription(`Subdomain: ${subdomain}\nRecord Type: ${recordType}\nRecord String: ${recordString}`)
        .addFields(
            { name: 'Forked', value: RedCross },
            { name: 'Commited', value: RedCross },
            { name: 'PR Opened', value: RedCross },
        )
        .setColor('#00b0f4')
        .setFooter({
            text: 'is-a.dev',
            icon_url: 'https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png'
        });
        await interaction.reply({ embeds: [embed] });
        await fork(interaction.user.id, interaction)
    },
};
