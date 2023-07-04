const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
async function EditModal(interaction) {
        const domains = interaction.values[0];
        const domain = domains.replace(/\.is-a\.dev$/, "");
        const response = await fetch(`https://raw.githubusercontent.com/is-a-dev/register/main/domains/${domain}.json`, {
                headers: {
                    "User-Agent": "is-a-dev-bot",
                },
            });
        const data = await response.json();
        const records = [];
        Object.keys(data.record).forEach((record) => {
            if (record === "A" || record === "MX") {
                data.record[record].forEach((r) => {
                    records.push(`**${record}** ${r}`);
                });

                return;
            }

            if (record === "URL") return records.push(`**${record}** ${data.record[record]}`);

            records.push(`**${record}** ${data.record[record]}`);
        });
        const recordC = records.join(", ");
        const modal = new ModalBuilder().setCustomId("editmodal").setTitle(`Edit: ${domains}`);
        const recordContent = new TextInputBuilder()
            .setCustomId(domain)
            .setLabel("What is the new content?")
            .setRequired(true)
            .setValue(recordC)
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Short);
        const secondActionRow = new ActionRowBuilder().addComponents(recordContent);

        // Add inputs to the modal
        modal.addComponents(secondActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
}
exports.EditModal = EditModal;