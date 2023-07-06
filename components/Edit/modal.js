const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, fetchRecommendedShardCount } = require("discord.js");
async function EditModal(interaction) {
        const domains = interaction.values[0];
        const domain = domains.replace(/\.is-a\.dev$/, "");
        const response = await fetch(`https://raw.githubusercontent.com/is-a-dev/register/main/domains/${domain}.json`, {
                headers: {
                    "User-Agent": "is-a-dev-bot",
                },
            });
        const data = await response.json();
        console.log(data);
        const records = [];
        Object.keys(data.record).forEach((record) => {
            if (record === "A" || record === "MX") {
                data.record[record].forEach((r) => {
                    records.push(`**${record}** ${r}`);
                });

                return;
            }

            if (record === "URL") return records.push(`**${record}** ${data.record[record]}`);

            records.push(`${data.record[record]}`);
        });
        // make a modal that displays the current records
        let recordsTypes = [];
        if (data.record === "CNAME") {
            recordsTypes.push("CNAME");
        }
        if (data.record === "A") {
            recordsTypes.push("A");
        }
        if (data.record === "MX") {
            recordsTypes.push("MX");
        }
        if (data.record === "URL") {
            recordsTypes.push("URL");
        }
        if (data.record === "TXT") {
            recordsTypes.push("TXT");
        }
        console.log(recordsTypes);


}
exports.EditModal = EditModal;