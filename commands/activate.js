const fetch = require("node-fetch");
const { SlashCommandBuilder } = require("discord.js");
const { GuildID } = require("../services/guildId.js");
const Maintainers = require("../models/maintainers.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("activate")
        .setDescription("Activate a hosts by is-a.dev domain.")
        .addStringOption((option) => option.setName("subdomain").setDescription("The subdomain to activate.").setRequired(true)),
    async execute(interaction) {
        const subdomain = interaction.options.getString("subdomain").toLowerCase();
        // get the guild id from the interaction
        const guildId = interaction.guildId;
        // get the guild object from the guild id
        const guild = GuildID(guildId);
        // if the guild object is false, then the guild is not registered
        if (!guild) return await interaction.reply({ content: "This guild is not registered with Domain Register Bot. Please contact the guild owner to register.", ephemeral: true });
        if (!(await Maintainers.findOne({ userid: interaction.user.id }))) {
            // make text appear in ephemeral message
            await interaction.reply({ content: "Only maintainers can use this command!", ephemeral: true });
            return;
        }


        if (subdomain.length <= 2 || subdomain.length > 64) return await interaction.reply("The subdomain length must be between 3 and 64 characters.");

        try {
            const response = await fetch(`https://hosts.is-a.dev/api/activate?domain=${subdomain}&NOTIFY_TOKEN=${process.env.WEBHOST_TOKEN}`, {
                headers: {
                    "User-Agent": "is-a-dev-bot",
                },
            });

            if (response.status === 200) {
                await interaction.reply(`${subdomain}.is-a.dev has been activated!`);
            } else {
                await interaction.reply(`Dam something went wrong. The server responded with ${response.status} speak to andrew or Danny`);
            }
        } catch (error) {
            console.error("Error occurred while checking domain availability:", error);
            await interaction.reply({ content: "An error occurred while checking the domain activation. Please try again later.", ephemeral: true });
        }
    },
};
