const fetch = require("node-fetch");
const { SlashCommandBuilder,EmbedBuilder } = require("discord.js");
const staff = require("../models/staff");
const Loading = require("../components/loading");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("activate")
        .setDescription("Activate a hosts by is-a.dev domain.")
        .addStringOption((option) =>
            option
                .setName("subdomain")
                .setDescription("The subdomain to activate.")
                .setRequired(true),
        ),
    async execute(interaction) {
        const subdomain = interaction.options
            .getString("subdomain")
            .toLowerCase();
       
        await Loading(interaction, false);

        if (!(await staff.findOne({ _id: interaction.user.id }))) {
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
                `https://hosts.is-a.dev/api/activate?domain=${subdomain}&NOTIFY_TOKEN=${process.env.WEBHOST_TOKEN}`,
                {
                    headers: {
                        "User-Agent": "is-a-dev-bot",
                    },
                },
            );

            if (response.status === 200) {
                await interaction.editReply(
                    `${subdomain}.is-a.dev has been activated!`,
                );
            } else {
                await interaction.editReply(
                    `Dam something went wrong. The server responded with ${response.status} speak to andrew or Danny`,
                );
            }
        } catch (error) {
            console.error(
                "Error occurred while checking domain availability:",
                error,
            );
            await interaction.editReply({
                content:
                    "An error occurred while checking the domain activation. Please try again later.",
                ephemeral: true,
            });
        }
    },
};
