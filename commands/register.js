const { SlashCommandBuilder } = require("discord.js");
const regiserDomain = require("../events/buttons/registerDomain");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Register a domain."),
    async execute(interaction) {
        await regiserDomain(interaction);
    },
};
