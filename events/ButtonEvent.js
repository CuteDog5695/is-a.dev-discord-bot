const ChooseDeleteDomain = require("./buttons/ChooseDeleteDomain")
const CancelDeleteDomain = require("./buttons/CancelDelete")
const ConfirmDelete = require("./buttons/ConfirmDelete")
module.exports = async function (interaction) {
    if (interaction.customId === "deleteDomain") {
        await ChooseDeleteDomain(interaction);
    }
    if (interaction.customId === "cancel-del") {
        await CancelDeleteDomain(interaction);
    }
    if (interaction.customId.startsWith("del-")) {
        ConfirmDelete(interaction);
    }
}