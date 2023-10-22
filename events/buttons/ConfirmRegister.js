const { MessageEmbed } = require('discord.js');
const Loading = require('../../components/loading');
const fork = require('../../components/fork');
const CreateFile = require('../../components/CreateFile');
const OpenPR = require('../../components/OpenPR');
module.exports = async function (interaction) {
    await Loading(interaction, true);
    const inputString = interaction.customId;
    var regex = /d-(.*?)-t-(.*?)-c-(.*)/;
    var match = regex.exec(inputString);
    let type = "";
    if (match) {
        var domain = match[1];
        var dtype = match[2];
        var content = match[3];
        console.log(inputString);
        switch (dtype) {
            //A Record
            case '1':
                type = "A"
                break;
            //AAAA Record
            case '2':
                type = "AAAA"
                break;
            //CNAME Record
            case '3':
                type = "CNAME"
                break;
            //MX Record
            case '4':
                type = "MX"
                break;
            //TXT Record
            case '5':
                type = "TXT"
                break;
        }
        await fork(interaction)
        // wait 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));
        if (await CreateFile(type, content, domain, interaction)) {
            await OpenPR(interaction, `Register ${domain}.is-a.dev`, `Register ${domain}.is-a.dev with ${type} record pointing to ${content}.`);
        }
    }
}



