const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const Loading = require('../../components/loading');
const DM = require('../../components/DmUser');
module.exports = async function (interaction) {
    await Loading(interaction, false);
   // get id from custom id aprove-<id>
    let id = interaction.customId
    console.log(id)
    id = id.split('-')[1]
    console.log(id)
    
    // unban user
    await interaction.guild.members.unban(id)
    // send dm
    const embed = new EmbedBuilder()
        .setTitle('Ban Appeal')
        .setDescription(`Dear user, Thank you for your ban appeal. After further discussion, and consideration from the is-a-dev team, we are unbanning you from the server. You are advised to reflect on the original reasoning for your ban, and are advised to avoid doing the same thing once admitted back into the server.`)
        .setColor('#00FF00')

    const inviteButton = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel('Join Server')
        .setURL('https://discord.gg/PZCGHz4RhQ')

    const actionRow = new ActionRowBuilder()
        .addComponent(inviteButton)

    await interaction.client.users.send(user, { embeds: [embed], components: [actionRow] });

    // reply to interaction
    await interaction.editReply({
        content: `Unbanned user <@${id}>`,
    })
}