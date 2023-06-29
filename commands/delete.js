const { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder, MessageSelectMenu } = require("discord.js");

const fetch = require("node-fetch");
const User = require("../models/user.js");

module.exports = {
    data: new SlashCommandBuilder().setName("delete").setDescription("Delete a domain."),
    async execute(interaction) {
        if (!interaction.member.roles.cache.some((role) => role.name === "Bot Beta Tester")) {
            await interaction.reply("Only beta testers can use this command!");
            return;
        }
        const githubUser = await User.findOne({ userid: interaction.user.id });

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
                    if (data[i].owner.username.toLowerCase() === username.toLowerCase()) {
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
                        .setCustomId('delete')
                        .setPlaceholder('Choose a domain to delete!')
                        .addOptions(results);

                    const row = new ActionRowBuilder().addComponents(select);

                    // Create the text input components
                    const response = await interaction.reply({
                        content: "Choose the domian you want to delete",
                        components: [row],
                    });
                    const collectorFilter = i => i.user.id === interaction.user.id;
                    try {
                        const selection = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
                        if (selection.customId === "delete") {
                            const domain = selection.values[0];
                            const confirm = new ButtonBuilder()
                                .setCustomId("confirm")
                                .setLabel("Confirm Delete")
                                .setStyle(ButtonStyle.Danger);
                            
                            const cancel = new ButtonBuilder()
                                .setCustomId("cancel")
                                .setLabel("Cancel")
                                .setStyle(ButtonStyle.Secondary);
                            
                            const row = new ActionRowBuilder()
                                .addComponents(cancel, confirm);
                            
                            await interaction.editReply({ content: `Are you sure you want to delete ${domain}?`, components: [row] });
                            const collectorFilter = i => i.user.id === interaction.user.id;
                            try {
                                const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
                                if (confirmation.customId === 'confirm') {
                                    await confirmation.update({ content: `Deleted ${domain}.`, components: [] });
                                } else if (confirmation.customId === 'cancel') {
                                    await confirmation.update({ content: 'Action cancelled', components: [] });
                                }
                            } catch (e) {
                                await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
                                return;
                            }
                        }

                    } catch (e) {
                        await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
                        return;
                    }
                }
            });
    },
};