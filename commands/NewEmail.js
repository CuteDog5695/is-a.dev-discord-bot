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
        const response = await fetch(`https://mail.is-a.dev/api/v1/get/domain/${domain}.is-a.dev`);
        const json = await response.json();
        if (json.active === `1`) {
            if (json.mboxes_left === `0`) {
                const full = new EmbedBuilder()
                    .setDescription("This domain has no mailboxes left!")
                    .setColor("#ff0000");
                return await interaction.editReply({ embeds: [full] });
            }
            return await interaction.editReply({ embeds: [embed] });


        }
        let newdomain = new EmbedBuilder()
            .setDescription("This domain does not exist!")
            .setColor("#ff0000");
        return await interaction.editReply({ embeds: [newdomain] });
    }
};