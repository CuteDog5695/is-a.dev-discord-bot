const { SlashCommandBuilder } = require("discord.js");
const fetch = require("node-fetch");
const Maintainers = require("../models/maintainers.js");
const { GuildID } = require("../services/guildId.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("whois")
        .setDescription("[MAINTAINER] Lookup a domain's information.")
        .addStringOption((option) => option.setName("domain").setDescription("The domain to lookup.").setRequired(true)),

    async execute(interaction) {
        const guildId = interaction.guildId;
        // get the guild object from the guild id
        const guild = GuildID(guildId);
        // if the guild object is false, then the guild is not registered
        if (!guild) return await interaction.reply({ content: "This guild is not registered with Domain Register Bot. Please contact the guild owner to register.", ephemeral: true });

        const domain = interaction.options.getString("domain").toLowerCase().replace(/\.is-a\.dev$/, "");

        if (!(await Maintainers.findOne({ userid: interaction.user.id }))) {
            // make text appear in ephemeral message
            await interaction.reply({ content: "Only maintainers can use this command!", ephemeral: true });
            return;
        }

        try {
            const response = await fetch(`https://raw.githubusercontent.com/is-a-dev/register/main/domains/${domain}.json`, {
                headers: {
                    "User-Agent": "is-a-dev-bot",
                },
            });

            if (response.status === 404) {
                await interaction.reply(`The domain ${domain}.is-a.dev is not registered!`);
            } else {
                const data = await response.json();

                const fileURL = `https://github.com/is-a-dev/register/blob/main/domains/${domain}.json`;

                const records = [];
                const contact = [];

                Object.keys(data.owner).forEach((owner) => {
                    if (owner === "username") return contact.push(`**${owner}** ${data.owner[owner]}`);
                    if (owner === "email") return contact.push(`**${owner}** ${data.owner[owner]}`);
                    if (owner === "discord") return contact.push(`**${owner}** ${data.owner[owner]}`);
                    if (owner === "twitter") return contact.push(`**${owner}** ${data.owner[owner]}`);
                    if (owner === "reddit") return contact.push(`**${owner}** ${data.owner[owner]}`);
                    if (owner === "note") return contact.push(`**${owner}** ${data.owner[owner]}`);
                });

                Object.keys(data.record).forEach((record) => {
                    if (record === "A" || record === "MX") {
                        data.record[record].forEach((r) => {
                            records.push(`**${record}** ${r}`);
                        });

                        return;
                    }

                    if (record === "URL") return records.push(`**${record}** ${data.record[record]}`);

                    records.push(`**${record}** ${data.record[record]}`);
                });

                const embed = {
                    title: `Whois: ${domain}.is-a.dev`,
                    url: fileURL,
                    fields: [
                        { name: "Contact", value: contact.join("\n"), inline: true },
                        { name: "Records", value: records.join("\n"), inline: true },
                    ],
                    color: 0x00ffff,
                    timestamp: new Date(),
                    footer: {
                        text: "is-a.dev",
                        icon_url: "https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png",
                    },
                };

                await interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error("Error performing whois lookup:", error);
            await interaction.reply({ content: "An error occurred while performing the Whois lookup. Please try again later.", ephemeral: true });
        }
    },
};
