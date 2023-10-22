const Loading = require('../../components/loading');
const fork = require('../../components/fork');
const deleteDomain = require('../../components/DeleteFile');
const OpenPR = require('../../components/OpenPR');
module.exports = async function (interaction) {
    await Loading(interaction, true);
    const domain = interaction.customId.slice(4);
    await fork(interaction);
    // wait 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));
    await deleteDomain(interaction, domain);
    let title = `Delete ${domain}`;
    let body = `Delete ${domain} via Discord`;
    await OpenPR(interaction, title, body);


}
    