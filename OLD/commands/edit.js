const {
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    MessageSelectMenu,
} = require("discord.js");

const fetch = require("node-fetch");
const User = require("../models/user.js");
const Maintainers = require("../models/maintainers.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("edit")
        .setDescription("Edit a domain."),
    async execute(interaction) {
        const githubUser = await User.findOne({ userid: interaction.user.id });
        const maintainers = await Maintainers.findOne({
            userid: interaction.user.id,
        });
        if (!maintainers) {
            await interaction.reply("You are not a maintainer!");
            return;
        }

        if (!githubUser) {
            await interaction.reply("You are not logged in!");
            return;
        }

        const username = githubUser.githubid;

        fetch("https://raw-api.is-a.dev")
            .then((response) => response.json())
            .then(async (data) => {
                let found = false;
                let results = [];
                for (let i = 0; i < data.length; i++) {
                    if (
                        data[i].owner.username.toLowerCase() ===
                        username.toLowerCase()
                    ) {
                        results.push({
                            label: data[i].domain,
                            value: data[i].domain,
                        });
                        found = true;
                    }
                }
                if (!found) {
                    await interaction.reply("You don't own any domains");
                    return;
                } else {
                    // Create a select menu
                    const select = new StringSelectMenuBuilder()
                        .setCustomId("edit")
                        .setPlaceholder("Choose a domain to edit!")
                        .addOptions(results);

                    const row = new ActionRowBuilder().addComponents(select);

                    // Create the text input components
                    await interaction.reply({
                        content: "Choose the domian you want to edit",
                        components: [row],
                        ephemeral: true,
                    });
                }
            });
    },
};
