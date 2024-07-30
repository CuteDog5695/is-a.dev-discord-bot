const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const fetch = require("node-fetch");
const staff = require("../models/staff");
const Loading = require("../components/loading");
const { EncryptPayload, DecryptPayload } = require("../components/owl");




module.exports = {
    data: new SlashCommandBuilder()
        .setName("decode")
        .setDescription("[MAINTAINER] Lookup a user's information.")
        .addStringOption((option) =>
            option
                .setName("owl")
                .setDescription("The key to lookup.")
                .setRequired(true),
        ),


    async execute(interaction) {
        
        
        await Loading(interaction, false);

        if (!(await staff.findOne({ _id: interaction.user.id }))) {
            const embed = new EmbedBuilder() 
                .setDescription("Only staff can use this command!")
                .setColor("#0096ff");
            return await interaction.editReply({ embeds: [embed], ephemeral: true });
        }


        try {
            const key = interaction.options.getString("owl");

            const decoded = await DecryptPayload(key);

            const userd = JSON.parse(decoded);

            const username = userd.username;
            const email = userd.email;
            const user_id = userd.user_id;

            const embed = new EmbedBuilder()
                .setTitle("User Information")
                .setColor("#0096ff")
                .setDescription(`**Username**: ${username}\n**Email**: ${email}\n**GitHub User ID**: ${user_id}`);

            await interaction.editReply({ embeds: [embed] });
            
        } catch (error) {
            console.error("Error performing lookup:", error);
            await interaction.editReply({
                content:
                    "An error occurred while performing the lookup. Please try again later.",
                ephemeral: true,
            });
        }
    },
};
