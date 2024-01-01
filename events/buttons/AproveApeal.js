const { EmbedBuilder } = require('discord.js');
const Loading = require('../../components/loading');
const DM = require('../../components/DmUser');
module.exports = async function (interaction) {
    await Loading(interaction, false);
    let id = interaction.customId.slice(6)
    console.log(id)
    let user = interaction.guild.members.cache.get(id)
    // get username
    let username = user.user.username
    // unban user
    await interaction.guild.members.unban(id)
    // send dm
    const embed = new EmbedBuilder()
        .setTitle('Ban Appeal')
        .setDescription(`Dear ${username}, Thank you for your ban appeal. After further discussion, and consideration from the is-a-dev team, we are unbanning you from the server. You are advised to reflect on the original reasoning for your ban, and are advised to avoid doing the same thing once admitted back into the server.`)
        .setColor('#00FF00')
    await DM(user, embed)

    // reply to interaction
    await interaction.editReply({
        content: `Unbanned ${username}`
    })
}