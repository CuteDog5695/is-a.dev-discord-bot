const fetch = require("node-fetch");
const { SlashCommandBuilder,EmbedBuilder } = require("discord.js");
const staff = require("../models/staff");
const emails = require("../models/emails");
const Loading = require("../components/loading");
const DmUser = require("../components/DmUser");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete-email")
        .setDescription("Delete email address. [Staff Only]")
        .addStringOption((option) =>
            option
                .setName("email")
                .setDescription("The full email address to delete.")
                .setRequired(true)
        ),
    async execute(interaction) {
        await Loading(interaction, true);
        const data = await staff.findOne({ _id: interaction.user.id });
        if (!data) {
            const embed = new EmbedBuilder()
                .setDescription("You are not staff!")
                .setColor("#0096ff");
            return await interaction.editReply({ embeds: [embed] });
        }
        const email = interaction.options.getString("email");
        let count = 0;
        let domain = email.split("@")[1];
        domain = domain.toLowerCase().replace(/\.is-a\.dev$/, "");
        const emailData = await emails.findOne({ _id: domain });
        if (!emailData) {
            const error = new EmbedBuilder()
                .setDescription("That domain does not exist!")
                .setColor("#0096ff");
            return await interaction.editReply({ embeds: [error] });
        }
        count = emailData.EmailCount;
        if (emailData) {
        // create the domain on the mailcow server
            const create = await fetch(`https://mail.is-a.dev/api/v1/delete/mailbox`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": process.env.MAILCOW_API_KEY,
                },
                body: [
                    email
                  ],
            });
            if (create.status !== 200) {
                const error = new EmbedBuilder()
                    .setDescription("There was an error deleting the mailbox on the mail server!")
                    .setColor("#0096ff");
                return await interaction.editReply({ embeds: [error] });
            }
        }

        let DiscordID = emailData.DiscordID;

        
        
        const embed = new EmbedBuilder()
            .setDescription(`Deleted ${email}!`)
            .setColor("#0096ff");

        await interaction.editReply({ embeds: [embed] });

        count--;

        await emails.updateOne({ _id: domain }, { EmailCount: count, });
            
        const DmEmbed = new EmbedBuilder()
            .setTitle("Email Deleted!")
            .setDescription(`Your email ${email} has been deleted!`)
            .setColor("#0096ff");

        await DmUser(interaction.client, DiscordID, DmEmbed);
    }
};


