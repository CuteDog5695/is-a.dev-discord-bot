const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const fetch = require("node-fetch");
const auth = require("../components/auth.js");
const User = require("../models/user.js");
const { GuildID } = require("../services/guildId.js");

module.exports = {
    data: new SlashCommandBuilder().setName("domains").setDescription("Lists all domains registered by you!"),
    async execute(interaction) {
        const guildId = interaction.guildId;
        // get the guild object from the guild id
        const guild = GuildID(guildId);
        console.log(guild);
        // if the guild object is false, then the guild is not registereds
        if (!guild) return await interaction.reply({ content: "This guild is not registered with Domain Register Bot. Please contact the guild owner to register.", ephemeral: true });
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
