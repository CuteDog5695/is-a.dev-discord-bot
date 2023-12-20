const fetch = require("node-fetch");
const { SlashCommandBuilder,EmbedBuilder } = require("discord.js");
const staff = require("../models/staff");
const emails = require("../models/emails");
const Loading = require("../components/loading");
const DmUser = require("../components/DmUser");

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
        let count = 0;
        domain = domain.toLowerCase().replace(/\.is-a\.dev$/, "");
        let user = interaction.options.getUser("user");
        let username = user.username;
        user = interaction.guild.members.cache.get(user.id);
        const emailData = await emails.findOne({ _id: domain });
        if (emailData) {
            count = emailData.EmailCount;
            if (emailData.EmailCount >= 2) {
                const max = new EmbedBuilder()
                    .setDescription("This domain already has hit the maximum amount of emails!")
                    .setColor("#0096ff");
                return await interaction.editReply({ embeds: [max] });
            }
        }
        if (!emailData) {
        // create the domain on the mailcow server
            const create = await fetch(`https://mail.is-a.dev/api/v1/add/domain`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": process.env.MAILCOW_API_KEY,
                },
                body: JSON.stringify({
                    "active": "1",
                    "aliases": "5",
                    "backupmx": "0",
                    "defquota": "50",
                    "description": "",
                    "domain": `${domain}.is-a.dev`,
                    "mailboxes": "2",
                    "maxquota": "60",
                    "quota": "120",
                    "relay_all_recipients": "0",
                    "rl_frame": "0",
                    "rl_value": "0",
                    "restart_sogo": "10",
                    "tags": []
                  }),
            });
            if (create.status !== 200) {
                const error = new EmbedBuilder()
                    .setDescription("There was an error creating the domain on the mail server!")
                    .setColor("#0096ff");
                return await interaction.editReply({ embeds: [error] });
            }
            await emails.create({ _id: domain, EmailCount: 0, DiscordID: user.id });
        }
        let DiscordName = user.username;
        // generate random password
        const password = Math.random().toString(36).slice(-8);
        const created = await fetch(`https://mail.is-a.dev/api/v1/add/mailbox`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": process.env.MAILCOW_API_KEY,
            },
            body: JSON.stringify({
                "active": "1",
                "domain": `${domain}.is-a.dev`,
                "local_part": email,
                "name": DiscordName,
                "password": password,
                "password2": password,
                "quota": "50",
                "force_pw_update": "0",
                "tls_enforce_in": "0",
                "tls_enforce_out": "0"
              }),
        });
        if (created.status !== 200) {
            const error = new EmbedBuilder()
                .setDescription("There was an error creating the email on the mail server!")
                .setColor("#0096ff");
            return await interaction.editReply({ embeds: [error] });
        }
        
        const embed = new EmbedBuilder()
            .setDescription(`Created email ${email}@${domain}.is-a.dev for ${username}! User has been DMed!`)
            .setColor("#0096ff");

        await interaction.editReply({ embeds: [embed] });

        count++;

        if (count === 1) {
            await emails.updateOne({ _id: domain }, { EmailCount: count, EmailOne: `${email}@${domain}.is-a.dev` });
        } else if (count === 2) {
            await emails.updateOne({ _id: domain }, { EmailCount: count, EmailTwo: `${email}@${domain}.is-a.dev` });
        }
            
        const DmEmbed = new EmbedBuilder()
            .setTitle("Email Created!")
            .setDescription(`Your email has been created! You can access it at https://mail.is-a.dev/rc/ or manage it at https://mail.is-a.dev/ \n Username: ${email}@${domain}.is-a.dev \n Password: ${password}`)
            .setColor("#0096ff");

        await DmUser(interaction.client, user, DmEmbed);
    }
};


