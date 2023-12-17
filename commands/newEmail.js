const fetch = require("node-fetch");
const { SlashCommandBuilder,EmbedBuilder } = require("discord.js");
const staff = require("../models/staff");
const emails = require("../models/emails");
const Loading = require("../components/loading");
const DmUser = require("../components/DmUser");
const MailcowApi = require("../components/MailcowApi");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("create-email")
        .setDescription("STAFF ONLY: Create a new email for a user.")
        .addStringOption((option) =>
            option
                .setName("email")
                .setDescription("The first part of the email to create.")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("domain")
                .setDescription("The domain to create the email on.")
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user to create the email for.")
                .setRequired(true)
        ),
    async execute(interaction) {
        await Loading(interaction, false);
        if (!(await staff.findOne({ _id: interaction.user.id }))) {
            const embed = new EmbedBuilder() 
                .setDescription("Only staff can use this command!")
                .setColor("#0096ff");
            return await interaction.editReply({ embeds: [embed], ephemeral: true });
        }
        const email = interaction.options.getString("email").toLowerCase();
        let domain = interaction.options.getString("domain").toLowerCase().replace(/\.is-a\.dev$/, "");
        const user = interaction.options.getUser("user");

        // generate a strong password
        const password = Math.random().toString(36).slice(-10);

        const userDoc = await emails.findOne({ _id: user.id });
        if (userDoc.EmailCount >= 2) {
            const embed = new EmbedBuilder() 
                .setDescription("This user already has 2 emails!")
                .setColor("#0096ff");
            return await interaction.editReply({ embeds: [embed], ephemeral: true });
        }
        const mailcow = new MailcowApi(process.env.MAILCOW_TOKEN);
        const domains = await mailcow.get("/api/v1/get/domain");
        const domainDoc = domains.filter((d) => d.domain === domain)[0];
        if (!domainDoc) {
            // If the domain doesn't exist, create it
            await mailcow.post("/api/v1/add/domain", {
                "active": "1",
                "aliases": "10",
                "backupmx": "0",
                "domain": domain,
                "mailboxes": "1",
                "maxquota": "100",
                "quota": "50",
                "relay_all_recipients": "0",
                "restart_sogo": "0"
              });
        }
        // create the email account
        await mailcow.post("/api/v1/add/mailbox", {
            "active": "1",
            "domain": domain,
            "local_part": email,
            "name": `${user.username}`,
            "quota": "50",
            "password": password
          });
        // add the email to the database
        await emails.updateOne(
            { _id: user.id },
            {
                $push: {
                    emails: {
                        email: `${email}@${domain}.is-a.dev`,
                            },
                },
                $inc: { EmailCount: 1 },
            },
            { upsert: true }
        );

        const embed = new EmbedBuilder() 
            .setDescription(`Created email ${email}@${domain}.is-a.dev with password ${password}`)
            .setColor("#0096ff");
        await interaction.editReply({ embeds: [embed], ephemeral: true });
    }
};