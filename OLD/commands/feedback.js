const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("feedback")
        .setDescription("Give feedback and suggestions!"),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId("feedback")
            .setTitle("Bot Feedback");

        // Add components to modal

        // Create the text input components
        const improvements = new TextInputBuilder()
            .setCustomId("improve")
            // The label is the prompt the user sees for this input
            .setLabel("What's could be improved?")
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short);

        const suggestions = new TextInputBuilder()
            .setCustomId("suggest")
            .setLabel("Do you have any suggestions?")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new ActionRowBuilder().addComponents(
            improvements,
        );
        const secondActionRow = new ActionRowBuilder().addComponents(
            suggestions,
        );

        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    },
};
