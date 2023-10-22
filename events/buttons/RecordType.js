const Loading = require('../../components/loading');
const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
module.exports = async function (interaction) {
    const Domain = interaction.customId.slice(9);
    console.log(Domain)
    await Loading(interaction, true);
    
    const embed = new EmbedBuilder()
        .setTitle("Choose a Record Type")
        .setDescription("Please choose a record type for your domain.")
        .setColor("#0096ff")
        .setFooter({
            text: "If using github pages, choose CNAME.",
            iconURL: "https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png"
        });

    const select = new StringSelectMenuBuilder()
        .setCustomId(`Type-${Domain}`)
        .setPlaceholder("Choose a record type")
        .addOptions([
            {
                label: "A",
                value: "A",
            },
            {
                label: "AAAA",
                value: "AAAA",
            },
            {
                label: "CNAME",
                value: "CNAME",
            },
            {
                label: "MX",
                value: "MX",
            },
            {
                label: "TXT",
                value: "TXT",
            }
        ]);
    
    const row = new ActionRowBuilder().addComponents(select);
    await interaction.editReply({
        embeds: [embed],
        components: [row]
    });
}


        
