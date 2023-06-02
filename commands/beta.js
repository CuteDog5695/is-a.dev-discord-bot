const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require("discord.js");
const User = require("../models/user.js");

module.exports = {
    data: new SlashCommandBuilder().setName("beta").setDescription("Join the beta testing team."),
    async execute(interaction) {

        const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm')
			.setStyle(ButtonStyle.Danger);

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder()
			.addComponents(cancel, confirm);

        //await User.findOneAndDelete({ userid: interaction.user.id });
        const response = await interaction.reply({
			content: `Are you sure you want to join the beta program? This will give you access to beta commands and features, but may be unstable.`,
			components: [row],
            ephemeral: true
		});

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
            if (confirmation.customId === 'confirm') {
                await interaction.member.roles.add(interaction.guild.roles.cache.find(role => role.name === "Bot Beta Tester"));
                await confirmation.update({ content: `You are now a beta tester!`, components: [] });
            } else if (confirmation.customId === 'cancel') {
                await confirmation.update({ content: 'Action cancelled', components: [] });
            }
        } catch (e) {
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
            return;
        }

    },
};
