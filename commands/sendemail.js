const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const Maintainers = require("../models/maintainers.js");

module.exports = {
    data: new SlashCommandBuilder().setName("send-email").setDescription("Maintainers send emails!").addStringOption((option) => option.setName("email").setDescription("Email to send to").setRequired(false)).addStringOption((option) => option.setName("subject").setDescription("Subject of email").setRequired(false)),
    async execute(interaction) {
        if (!(await Maintainers.findOne({ userid: interaction.user.id }))) {
            // make text appear in ephemeral message
            await interaction.reply({ content: "Only maintainers can use this command!", ephemeral: true });
            return;
        }
        const emailAddress = interaction.options.getString("email");
        const emailSubject = interaction.options.getString("subject");
        const modal = new ModalBuilder().setCustomId("sendemail").setTitle("Send Email");

        if (!emailAddress) {
            const emailAddress = "email"
        }
        if (!emailSubject) {
            const emailSubject = "subject"
        }


        // Create the text input components
        const email = new TextInputBuilder()
            .setCustomId("email")
            // The label is the prompt the user sees for this input
            .setLabel("To email?")
            .setValue(emailAddress)
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short)


        const subject = new TextInputBuilder()
            .setCustomId("subject")
            .setLabel("What is the email subject?")
            .setValue(emailSubject)
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Short);

        const message = new TextInputBuilder()
            .setCustomId("message")
            .setLabel("What's the message?")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph);    


        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new ActionRowBuilder().addComponents(email);
        const secondActionRow = new ActionRowBuilder().addComponents(subject);
        const thirdActionRow = new ActionRowBuilder().addComponents(message);

        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    },
};
