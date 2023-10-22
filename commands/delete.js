const { SlashCommandBuilder } = require("discord.js");
const ChooseDeleteDomain = require("../events/buttons/ChooseDeleteDomain");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete")
        .setDescription("Delete a domain."),
    async execute(interaction) {
        await ChooseDeleteDomain(interaction);
    },
};
