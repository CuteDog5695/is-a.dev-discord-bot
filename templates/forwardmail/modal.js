const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

async function ForwardMailModal(interaction) {
    const modal = new ModalBuilder().setCustomId("emailforward").setTitle("Email Forwarder");

    // Add components to modal
    const subdomain = new TextInputBuilder().setCustomId("subdomain").setLabel("What subdomain do you want?").setPlaceholder("subdomain").setMinLength(3).setMaxLength(20).setRequired(true).setStyle(TextInputStyle.Short);

    // Create the text input components
    const email = new TextInputBuilder()
        .setCustomId("emailaddress")
        // The label is the prompt the user sees for this input
        .setLabel("What's the email to forward to?")
        // Short means only a single line of text
        .setStyle(TextInputStyle.Short);

    const firstActionRow = new ActionRowBuilder().addComponents(email);
    const secondActionRow = new ActionRowBuilder().addComponents(subdomain);

    modal.addComponents(firstActionRow, secondActionRow);

    // Show the modal to the user
    await interaction.showModal(modal);
}

exports.ForwardMailModal = ForwardMailModal;
