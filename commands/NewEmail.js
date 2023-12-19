const fetch = require("node-fetch");
const { SlashCommandBuilder,EmbedBuilder } = require("discord.js");
const staff = require("../models/staff");
const Loading = require("../components/loading");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("new-email")
        .setDescription("Create a new email address. [Staff Only]")
        .addStringOption((option) =>
            option
                .setName("email")
                .setDescription("The email address to create. bit before the @")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("domain")
                .setDescription("The domain to create the email address on. bit after the @")
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user to create the email address for.")
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
        let domain = interaction.options.getString("domain");
        domain = domain.toLowerCase().replace(/\.is-a\.dev$/, "");
        const user = interaction.options.getUser("user");
        const embed = new EmbedBuilder()
            .setTitle("New Email")
            .setDescription(`Email: ${email}@${domain}.is-a.dev\nUser: ${user}`)
            .setColor("#0096ff");
        
        // check if domain exists on mailcow api not mailbox
        const mailcow = await fetch(`https://mail.is-a.dev/api/v1/get/domain/${domain}`, {
            method: "GET",
            headers: {
                "X-API-Key": process.env.MAILCOW_API_KEY,
            },
        });
        const mailcowData = await mailcow.json();
        if (mailcowData.status === 200) {
            const embed = new EmbedBuilder()
                .setDescription("This domain already exists!")
                .setColor("#ff0000");
            return await interaction.editReply({ embeds: [embed] });
        }

        
        let newdomain = new EmbedBuilder()
            .setDescription("This domain does not exist!")
            .setColor("#ff0000");
        return await interaction.editReply({ embeds: [newdomain] });
    }
};