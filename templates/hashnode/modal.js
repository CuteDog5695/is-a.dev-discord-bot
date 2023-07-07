const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

async function HashNode(interaction) {
    const modal = new ModalBuilder().setCustomId("hashnode").setTitle("HashNode with is-a.dev subdomain");

    // Add components to modal
    const subdomain = new TextInputBuilder().setCustomId("subdomain").setLabel("What subdomain do you want?").setPlaceholder("subdomain").setMinLength(3).setMaxLength(20).setRequired(true).setStyle(TextInputStyle.Short);

    // Create the text input components

    const secondActionRow = new ActionRowBuilder().addComponents(subdomain);

    modal.addComponents(secondActionRow);

    // Show the modal to the user
    await interaction.showModal(modal);
}

exports.HashNode = HashNode;
