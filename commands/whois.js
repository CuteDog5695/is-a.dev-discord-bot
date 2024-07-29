const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const fetch = require("node-fetch");
const staff = require("../models/staff");
const Loading = require("../components/loading");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("whois")
        .setDescription("[Lookup a domain's information.")
        .addStringOption((option) =>
            option
                .setName("domain")
                .setDescription("The domain to lookup.")
                .setRequired(true),
        )
        .addBooleanOption((option) =>
            option
                .setName("ephemeral")
                .setDescription("Make the response ephemeral.")
                .setRequired(false),
        ),

    async execute(interaction) {
        
        const domain = interaction.options
            .getString("domain")
            .toLowerCase()
            .replace(/\.is-a\.dev$/, "");

        const ephemeral = interaction.options.getBoolean("ephemeral");
        if (ephemeral === undefined) ephemeral = false;
        await Loading(interaction, ephemeral);



        try {
            const response = await fetch(
                `https://raw.githubusercontent.com/is-a-dev/register/main/domains/${domain}.json`,
                {
                    headers: {
                        "User-Agent": "is-a-dev-bot",
                    },
                },
            );

            let web = `https://${domain}.is-a.dev`

            if (response.status === 404) {
                const sadEmbed = new EmbedBuilder()
                    .setDescription(
                        "That domain doesn't exist in the register.",
                    )
                    .setColor("#0096ff");
                await interaction.editReply({ embeds: [sadEmbed], ephemeral: ephemeral });
            } else {
                const data = await response.json();

                const fileURL = `https://github.com/is-a-dev/register/blob/main/domains/${domain}.json`;

                const records = [];
                const contact = [];

                Object.keys(data.owner).forEach((owner) => {
                    if (owner === "username")
                        return contact.push(
                            `**${owner}** ${data.owner[owner]}`,
                        );
                    if (owner === "email")
                        return contact.push(
                            `**${owner}** ${data.owner[owner]}`,
                        );
                    if (owner === "discord")
                        return contact.push(
                            `**${owner}** ${data.owner[owner]}`,
                        );
                    if (owner === "twitter")
                        return contact.push(
                            `**${owner}** ${data.owner[owner]}`,
                        );
                    if (owner === "reddit")
                        return contact.push(
                            `**${owner}** ${data.owner[owner]}`,
                        );
                    if (owner === "note")
                        return contact.push(
                            `**${owner}** ${data.owner[owner]}`,
                        );
                });

                Object.keys(data.record).forEach((record) => {
                    if (record === "A" || record === "MX") {
                        data.record[record].forEach((r) => {
                            records.push(`**${record}** ${r}`);
                        });

                        return;
                    }

                    if (record === "URL")
                        return records.push(
                            `**${record}** ${data.record[record]}`,
                        );

                    records.push(`**${record}** ${data.record[record]}`);
                });

                const embed = {
                    title: `Whois: ${domain}.is-a.dev`,
                    url: fileURL,
                    fields: [
                        {
                            name: "Contact",
                            value: contact.join("\n"),
                            inline: true,
                        },
                        {
                            name: "Records",
                            value: records.join("\n"),
                            inline: true,
                        },
                    ],
                    color: 0x00ffff,
                    timestamp: new Date(),
                    footer: {
                        text: "is-a.dev",
                        icon_url:
                            "https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png",
                    },
                };


                const webButton = new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Visit")
                    .setURL(web);

                const GitHubButton = new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("GitHub")
                    .setEmoji("🐙")
                    .setURL(fileURL);

                const OwlButton = new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel("OWL")
                    .setCustomId(`owl-${domain}`)
                    .setEmoji("🦉");

                const row = new ActionRowBuilder().addComponents(webButton, GitHubButton, OwlButton);

                await interaction.editReply({ embeds: [embed], ephemeral: ephemeral, components: [row] });
            }
        } catch (error) {
            console.error("Error performing whois lookup:", error);
            await interaction.editReply({
                content:
                    "An error occurred while performing the Whois lookup. Please try again later.",
                ephemeral: true,
            });
        }
    },
};
