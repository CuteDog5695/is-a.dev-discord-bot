const fetch = require("node-fetch");
const { SlashCommandBuilder } = require("discord.js");
const { GuildID } = require("../services/guildId.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("check")
        .setDescription("Check if a domain is available.")
        .addStringOption((option) =>
            option
                .setName("subdomain")
                .setDescription("The subdomain to check.")
                .setRequired(true),
        ),
    async execute(interaction) {
        const subdomain = interaction.options
            .getString("subdomain")
            .toLowerCase();
        // get the guild id from the interaction
        const guildId = interaction.guildId;
        // get the guild object from the guild id
        const guild = GuildID(guildId);
        // if the guild object is false, then the guild is not registered
        if (!guild)
            return await interaction.reply({
                content:
                    "This guild is not registered with Domain Register Bot. Please contact the guild owner to register.",
                ephemeral: true,
            });

        if (subdomain.length < 2 || subdomain.length > 64)
            return await interaction.reply(
                "The subdomain length must be between 2 and 64 characters.",
            );

        try {
            const response = await fetch(
                `https://api.github.com/repos/is-a-dev/register/contents/domains/${subdomain}.json`,
                {
                    headers: {
                        "User-Agent": "is-a-dev-bot",
                    },
                },
            );

            if (response.status === 404) {
                await interaction.reply(
                    `Congratulations, ${subdomain}.is-a.dev is available!`,
                );
            } else {
                await interaction.reply(
                    `Sorry, ${subdomain}.is-a.dev is taken!`,
                );
            }
        } catch (error) {
            console.error(
                "Error occurred while checking domain availability:",
                error,
            );
            await interaction.reply({
                content:
                    "An error occurred while checking the domain availability. Please try again later.",
                ephemeral: true,
            });
        }
    },
};
