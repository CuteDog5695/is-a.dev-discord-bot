const ChooseEmail = require("./select/ChooseEmail");
const deleteDomain = require("./select/delete");
const RecordContent = require("./select/RecordContent");
module.exports = async function (interaction) {
    if (interaction.customId === "email") {
        await ChooseEmail(interaction);
    }
    if (interaction.customId === "delete") {
        await deleteDomain(interaction);
    }
    if (interaction.customId.startsWith("Type-")) {
        await RecordContent(interaction);
    }
    
};