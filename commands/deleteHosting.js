const fetch = require("node-fetch");
const { SlashCommandBuilder,EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const staff = require("../models/staff");
const Loading = require("../components/loading");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deletehosting")
        .setDescription("Delete hosting data for a domain.")
        .addStringOption((option) =>
            option
                .setName("subdomain")
                .setDescription("The subdomain to delete.")
                .setRequired(true),
        ),
    async execute(interaction) {
        const subdomain = interaction.options
            .getString("subdomain")
            .toLowerCase();
       
        await Loading(interaction, false);

        if (!(await staff.findOne({ _id: interaction.user.id })) && !interaction.member.roles.cache.has("970789483836485763")) {
            const embed = new EmbedBuilder() 
                .setDescription("Only staff can use this command!")
                .setColor("#0096ff");
            return await interaction.editReply({ embeds: [embed], ephemeral: true });
        }

        if (subdomain.length < 2 || subdomain.length > 64)
            return await interaction.reply(
                "The subdomain length must be between 2 and 64 characters.",
            );

        try {
            const response = await fetch(
                `https://hostingdata.p2pb.dev/api/staff/delete?domain=${subdomain}&token=${process.env.STAFF_TOKEN}`,
                {
                    headers: {
                        "User-Agent": "is-a-dev-bot",
                    },
                },
            );

            if (response.status === 200) {
                const json = await response.json();
                const embed = new EmbedBuilder()
                    .setDescription(`Deleted ${subdomain}.is-a.dev hosting data. Export link is valid till <t:${parseInt(json.expiryDate / 1000)}:R>`) 
                const button = new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Export")
                    .setURL(json.export)
                    .setEmoji("📤")
                
                const row = new ActionRowBuilder()
                    .addComponents(button)
                    
                await interaction.editReply({ embeds: [embed], components: [row] });
                
            } else {
                await interaction.editReply(
                    `The server responded with ${response.status} speak to Andrew`,
                );
            }
        } catch (error) {
            console.error(
                "Error occurred while checking domain availability:",
                error,
            );
            await interaction.editReply({
                content:
                    "Please try again later.",
                ephemeral: true,
            });
        }
    },
};
