const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const fetch = require("node-fetch");
const auth = require("../components/auth.js");
const User = require("../models/user.js");

module.exports = {
    data: new SlashCommandBuilder().setName("domains").setDescription("Lists all domains registered by you!"),
    async execute(interaction) {
        const githubUser = await User.findOne({ userid: interaction.user.id });

        const authUrl = auth.getAccessToken(interaction.user.id);
        const loginBtn = new ActionRowBuilder().addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Login with GitHub").setURL(authUrl));
        // add text reply if user is not logged in. along with login button
        if (!githubUser) return await interaction.reply({ content: `Please login first`, components: [loginBtn], ephemeral: true });

        const username = githubUser.githubid;

        fetch("https://raw-api.is-a.dev")
            .then((response) => response.json())
            .then(async (data) => {
                let found = false;
                let results = [];

                for (let i = 0; i < data.length; i++) {
                    if (data[i].owner.username.toLowerCase() === username.toLowerCase()) {
                        results.push(data[i].domain);
                        found = true;
                    }
                }

                if (found) {
                    const embed = new EmbedBuilder().setTitle("Your Domains").setDescription(results.join("\n")).setColor("#00b0f4").setFooter({
                        text: "is-a.dev",
                        iconURL: "https://raw.githubusercontent.com/is-a-dev/register/main/media/logo.png",
                    });

                    await interaction.reply({ embeds: [embed] });
                } else {
                    await interaction.reply("You don't own any domains.");
                }
            });
    },
};
