const { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle  } = require("discord.js");
const { compile } = require("ejs");
async function DeleteDomain(interaction) {
    const domain = interaction.values[0];
    console.log(domain);
    console.log(interaction);
    console.log(interaction.user);
    const username = interaction.user.username;
    const confirm = new ButtonBuilder()
            .setCustomId("confirm")
            .setLabel("Confirm Delete")
            .setStyle(ButtonStyle.Danger);
                            
    const cancel = new ButtonBuilder()
            .setCustomId("cancel")
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Secondary);
                            
    const row = new ActionRowBuilder()
            .addComponents(cancel, confirm);

    await interaction.editReply({ content: `Are you sure you want to delete ${domain}?`, components: [row] });
}


exports.DeleteDomain = DeleteDomain;