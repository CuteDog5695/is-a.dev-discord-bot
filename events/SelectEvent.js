const ChooseEmail = require("./select/ChooseEmail");
const deleteDomain = require("./select/delete");
module.exports = async function (interaction) {
    if (interaction.customId === "email") {
        await ChooseEmail(interaction);
    }
    if (interaction.customId === "delete") {
        await deleteDomain(interaction);
    }
    
};