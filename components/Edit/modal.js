const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
async function EditModal(interaction) {
        const domains = interaction.values[0];
        const domain = domains.replace(/\.is-a\.dev$/, "");
        const modal = new ModalBuilder().setCustomId("editmodal").setTitle("domain").setDescription("Please fill out the form below to edit your domain.");
        const recordContent = new TextInputBuilder()
            .setCustomId("content")
            .setLabel("What is the new content?")
            .setRequired(true)
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Short);

        const secondActionRow = new ActionRowBuilder().addComponents(recordContent);

        // Add inputs to the modal
        modal.addComponents(secondActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
}
exports.EditModal = EditModal;