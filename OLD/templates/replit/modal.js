const {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require("discord.js");

async function Replit(interaction) {
    const modal = new ModalBuilder()
        .setCustomId("Replit")
        .setTitle("Replit with is-a.dev subdomain [CNAME]");

    // Add components to modal
    const subdomain = new TextInputBuilder()
        .setCustomId("subdomain")
        .setLabel("What subdomain do you want?")
        .setPlaceholder("subdomain")
        .setMinLength(3)
        .setMaxLength(20)
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

    // Create the text input components
    const replurl = new TextInputBuilder()
        .setCustomId("replurl")
        // The label is the prompt the user sees for this input
        .setLabel("What's the address to point the subdomain to?")
        // Short means only a single line of text
        .setStyle(TextInputStyle.Short);

    const firstActionRow = new ActionRowBuilder().addComponents(replurl);
    const secondActionRow = new ActionRowBuilder().addComponents(subdomain);

    modal.addComponents(firstActionRow, secondActionRow);

    // Show the modal to the user
    await interaction.showModal(modal);
}

exports.Replit = Replit;
