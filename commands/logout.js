const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require("discord.js");
const User = require("../models/user.js");

module.exports = {
    data: new SlashCommandBuilder().setName("logout").setDescription("Logout from the bot."),
    async execute(interaction) {
        if (!interaction.member.roles.cache.some((role) => role.name === "Bot Beta Tester")) return await interaction.reply("Only beta testers can use this command!");

        if (! await User.findOne({ userid: interaction.user.id })) return await interaction.reply({content: "You are not logged in!", ephemeral: true});

        const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm Logout')
			.setStyle(ButtonStyle.Danger);

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder()
			.addComponents(cancel, confirm);

        //await User.findOneAndDelete({ userid: interaction.user.id });
        const response = await interaction.reply({
			content: `Are you sure you want to logout?`,
			components: [row],
            ephemeral: true
		});

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
            if (confirmation.customId === 'confirm') {
                await User.findOneAndDelete({ userid: interaction.user.id });
                await confirmation.update({ content: `Logged out.`, components: [] });
            } else if (confirmation.customId === 'cancel') {
                await confirmation.update({ content: 'Action cancelled', components: [] });
            }
        } catch (e) {
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
            return;
        }

    },
};
