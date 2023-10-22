const { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const loading = require("../components/loading");
const user = require("../models/user");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("email")
        .setDescription("Change email used for is-a.dev"),
    async execute(interaction) {
        await loading(interaction, true);
        const data = await user.findOne({ _id: interaction.user.id });
        if (!data) {
            const embed = new EmbedBuilder()
                .setDescription("You are not logged in!")
                .setColor("#0096ff");
            return await interaction.editReply({ embeds: [embed] });
        }
        const accessToken = data.githubAccessToken;
        const emailResponse = await fetch(
            "https://api.github.com/user/emails",
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        const emailData = await emailResponse.json();
        let results = [];
        let found = false;
        for (let i = 0; i < emailData.length; i++) {
             {
                results.push({
                    label: emailData[i].email,
                    value: emailData[i].email,
                });
                found = true;
            }
        }
        const embed = new EmbedBuilder()
            .setDescription("Please choose a email to use")
            .setColor("#0096ff");
        const select = new StringSelectMenuBuilder()
            .setCustomId("email")
            .setPlaceholder("Choose a email to use!")
            .addOptions(results);

        const row = new ActionRowBuilder().addComponents(select);

            // Create the text input components
        await interaction.editReply({
            embeds: [embed],
            components: [row],
            ephemeral: true,
        });    

    },
};
