const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const Loading = require('../../components/loading');
const staff = require('../../models/staff');
const { EncryptPayload, DecryptPayload } = require("../../components/owl");

async function fetchDomainData(domain) {
    const response = await fetch(
        `https://raw.githubusercontent.com/is-a-dev/register/main/domains/${domain}.json`,
        {
            headers: {
                "User-Agent": "is-a-dev-bot",
            },
        },
    );

    if (response.status === 404) {
        return null;
    }
    return await response.json();
}

async function sendEmbed(interaction, description, color = "#0096ff", ephemeral = false) {
    const embed = new EmbedBuilder().setDescription(description).setColor(color);
    await interaction.editReply({ embeds: [embed], ephemeral: ephemeral });
}

module.exports = async function (interaction) {
    await Loading(interaction, true);
    const inputString = interaction.customId;
    const regex = /owl-(.*?)/;
    const match = regex.exec(inputString);

    if (!match) {
        return sendEmbed(interaction, "Invalid domain identifier.", "#ff0000", true);
    }

    const domain = match[1];
    console.log(domain);

    const staffData = await staff.findOne({ _id: interaction.user.id });
    if (!staffData) {
        return sendEmbed(interaction, "You are not staff!");
    }

    const domainData = await fetchDomainData(domain);
    if (!domainData) {
        return sendEmbed(interaction, "That domain doesn't exist in the register.", true);
    }

    if (!domainData.owner.OWL) {
        return sendEmbed(interaction, "That domain doesn't have an OWL field.", true);
    }

    try {
        const decoded = await DecryptPayload(domainData.owner.OWL);
        const userd = JSON.parse(decoded);
        const username = userd.username;
        const email = userd.email;
        const user_id = userd.user_id;
        const embed = new EmbedBuilder()
            .setTitle("User Information")
            .setColor("#0096ff")
            .setDescription(`\n**Decoded:** \n\nUsername: ${username}\nEmail: ${email}\nUser ID: ${user_id}`);
        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error("Error decrypting payload:", error);
        return sendEmbed(interaction, "Failed to decrypt OWL data.", "#ff0000", true);
    }
}
