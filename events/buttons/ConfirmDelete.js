const Loading = require('../../components/loading');
const fork = require('../../components/fork');
module.exports = async function (interaction) {
    await Loading(interaction, true);
    const domain = interaction.customId.slice(4);
    fork(interaction);


}
    