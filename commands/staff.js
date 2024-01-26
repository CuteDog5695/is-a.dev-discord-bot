const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const fetch = require("node-fetch");
const staff = require("../models/staff");
const Loading = require("../components/loading");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("staff")
        .setDescription("Staff Stuff")
        .addUserOption((option) =>
            option
                .setName("Add Staff")
                .setDescription("Adds a user to the staff database.")
                .setRequired(false)
        )
        .addUserOption((option) =>
            option
                .setName("Remove Staff")
                .setDescription("Removes a user from the staff database.")
                .setRequired(false)
        ),
    async execute(interaction) {
        await Loading(interaction, true);
        const data = await staff.findOne({ _id: interaction.user.id });
        if (!data) {
            const embed = new EmbedBuilder()
                .setDescription("You are not staff!")
                .setColor("#0096ff");
            return await interaction.editReply({ embeds: [embed] });
        }
        if (interaction.user.id !== "598245488977903688" && interaction.user.id !== "853158265466257448") {
            const embed = new EmbedBuilder()
                .setDescription("Only Andrew Or Wily can use this command!")
                .setColor("#0096ff");
            return await interaction.editReply({ embeds: [embed] });
        }
        const add = interaction.options.getUser("Add Staff");
        const remove = interaction.options.getUser("Remove Staff");
        if (add) {
            const addData = await staff.findOne({ _id: add.id });
            if (addData) {
                const embed = new EmbedBuilder()
                    .setDescription("This user is already staff!")
                    .setColor("#0096ff");
                return await interaction.editReply({ embeds: [embed] });
            }
            await new staff({
                _id: add.id,
                staff: true,
            }).save();
            const embed = new EmbedBuilder()
                .setDescription(`${add.username} has been added to the staff database!`)
                .setColor("#0096ff");
            return await interaction.editReply({ embeds: [embed] });
        }
        if (remove) {
            const removeData = await staff.findOne({ _id: remove.id });
            if (!removeData) {
                const embed = new EmbedBuilder()
                    .setDescription("This user is not staff!")
                    .setColor("#0096ff");
                return await interaction.editReply({ embeds: [embed] });
            }
            await staff.deleteOne({ _id: remove.id });
            const embed = new EmbedBuilder()
                .setDescription(`${remove.username} has been removed from the staff database!`)
                .setColor("#0096ff");
            return await interaction.editReply({ embeds: [embed] });
        }
        if (!add && !remove) {
            // list all staff
            const staffData = await staff.find();
            const staffArray = [];
            for (const staff of staffData) {
                staffArray.push(`<@${staff._id}>`);
            }
            const embed = new EmbedBuilder()
                .setDescription(`Staff: ${staffArray.join(", ")}`)
                .setColor("#0096ff");
            return await interaction.editReply({ embeds: [embed] });
        }
    }
};