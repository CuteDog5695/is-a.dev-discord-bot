module.exports = async function (interaction) {
    // delete the original message
    await interaction.message.delete();
};