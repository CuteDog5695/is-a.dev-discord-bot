const { SlashCommandBuilder } = require("discord.js");
const Maintainer = require("../models/maintainers.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("maintainer")
        .setDescription("Add staff controls.")
        .addBooleanOption((option) => option.setName("add").setDescription("Add or remove a maintainer.").setRequired(true))
        .addUserOption((option) => option.setName("user").setDescription("The user to add or remove.").setRequired(true)),
    async execute(interaction) {
        if (interaction.user.id !== "598245488977903688") return await interaction.reply("Only the bot owner can use this command!");

        const add = interaction.options.getBoolean("add");
        const user = interaction.options.getUser("user");

        if (add) {
            await Maintainer.create({
                userid: user.id,
                maintainer: true,
            });

            await interaction.reply(`Added ${user.username} as a maintainer.`);
        } else {
            await Maintainer.findOneAndDelete({ userid: user.id });
            await interaction.reply(`Removed ${user.username} as a maintainer.`);
        }
    },
};
