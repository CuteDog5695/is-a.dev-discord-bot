const ChooseDeleteDomain = require("./buttons/ChooseDeleteDomain")
const CancelDeleteDomain = require("./buttons/CancelDelete")
const ConfirmDelete = require("./buttons/ConfirmDelete")
const registerDomain = require("./buttons/registerDomain")
const RecordType = require("./buttons/RecordType")
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
    if (interaction.customId === "registerDomain") {
        await registerDomain(interaction);
    }
    if (interaction.customId === "tryagain") {
        await registerDomain(interaction);
    }
    if (interaction.customId.startsWith("register-")) {
        RecordType(interaction);
    }
}