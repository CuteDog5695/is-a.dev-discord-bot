const { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle  } = require("discord.js");
async function DeleteDomain(interaction) {
    const domain = interaction.values[0];
    console.log(domain);
    console.log(interaction.user);
    const username = interaction.user.username;
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

    const response = await interaction.reply({
            content: `Are you sure you want to delete ${domain}?`,
            components: [row],
            ephemeral: true,
    });
    const collectorFilter = (i) => i.user.id === interaction.user.id;
    try {
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
        if (confirmation.customId === "confirm") {
            await confirmation.update({ content: `Delete.`, components: [] });
        } else if (confirmation.customId === "cancel") {
            await confirmation.update({ content: "Action cancelled", components: [] });
        }
    } catch (e) {
        await interaction.editReply({ content: "Confirmation not received within 1 minute, cancelling", components: [] });
        return;
    }
    
}


exports.DeleteDomain = DeleteDomain;