const Loading = require('../../components/loading');
const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = async function (interaction) {
    await Loading(interaction, true);
    const subdomain = interaction.fields.getTextInputValue("DomainCheck");
    const response = await fetch(
        `https://api.github.com/repos/is-a-dev/register/contents/domains/${subdomain}.json`,
        {
            headers: {
                "User-Agent": "is-a-dev-bot",
            },
            cache: "no-cache",
        },
    );

    if (response.status === 404) {
        const embed = new EmbedBuilder()
           // domain is available
            .setDescription(`Congratulations, ${subdomain}.is-a.dev is available!`)
            .setColor("#0096ff");
        const button = new ButtonBuilder()
            .setCustomId(`register-${subdomain}`)
            .setLabel("Register IT")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);
        await interaction.editReply({
            components: [row],
            ephemeral: true,
            embeds: [embed]
        });    
    } else {
        const sadEmbed = new EmbedBuilder()
            // domain is taken
            .setDescription(`Sorry, ${subdomain}.is-a.dev is taken!`)
            .setColor("#0096ff");

        const tryagin = new ButtonBuilder()
            .setCustomId(`tryagain`)
            .setLabel("Try Again")
            .setStyle(ButtonStyle.Primary);
        
        const sadrow = new ActionRowBuilder().addComponents(tryagin);
        await interaction.editReply({
            components: [sadrow],
            ephemeral: true,
            embeds: [sadEmbed]
        });

    }
}