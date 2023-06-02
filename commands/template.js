const { SlashCommandBuilder } = require("discord.js");
const User = require("../models/user.js");
const { ForwardMailModal } = require("../templates/forwardmail/modal.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("template")
        .setDescription("Replies with Pong!")
        .addStringOption((option) => option.setName("templates").setDescription("Select the template").setRequired(true).addChoices({ name: "Email Forwarder", value: "EmailForward" }, { name: "Github Pages", value: "github" })),
    async execute(interaction) {
        if (!interaction.member.roles.cache.some((role) => role.name === "Bot Beta Tester")) return await interaction.reply("Only beta testers can use this command!");

        const githubUser = await User.findOne({ userid: interaction.user.id });

        if (!githubUser) return await interaction.reply("You are not logged in!");

        const template = interaction.options.getString("templates");

        switch (template) {
            case "EmailForward":
                await ForwardMailModal(interaction);
                break;
            case "github":
                await interaction.reply("Github Pages");
                break;
            default:
                return await interaction.reply("Invalid template.");
        }
    },
};
