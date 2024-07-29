const fetch = require("node-fetch");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");


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
        
if (subdomain.length < 1 || subdomain.length > 100) {
            const sadEmbed = new EmbedBuilder()
                .setDescription("The subdomain length must be between 1 and 100 characters.")
                .setColor("#0096ff");
            return await interaction.reply({ embeds: [sadEmbed] });    
}
        
        try {
            const response = await fetch(
                `https://api.github.com/repos/is-a-dev/register/contents/domains/${subdomain}.json`,
                {
                    headers: {
                        "User-Agent": "is-a-dev-bot",
                    },
                    cache: "no-cache",
                },
            );

            if (response.status === 404) {
                const happyEmbed = new EmbedBuilder()
                    .setDescription(`Congratulations, ${subdomain}.is-a.dev is available!`)
                    .setColor("#0096ff");
                await interaction.reply({ embeds: [happyEmbed] }
                );
            } else {
                const sadEmbed = new EmbedBuilder()
                    .setDescription(`Sorry, ${subdomain}.is-a.dev is taken!`)
                    .setColor("#0096ff");
                await interaction.reply({ embeds: [sadEmbed] }
                );
            }
        } catch (error) {
            console.error(
                "Error occurred while checking domain availability:",
                error,
            );
            const sadEmbed = new EmbedBuilder()
                .setDescription("An error occurred while checking domain availability.")
                .setColor("#0096ff");
            await interaction.reply({ embeds: [sadEmbed]
            });
        }
    },
};
