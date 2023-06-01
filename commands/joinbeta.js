const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("beta").setDescription("Launches a modal"),
  async execute(interaction) {
    await interaction.reply("Please wait...");
    const member = interaction.member;

    await interaction.editReply({
      content: "Please Wait!",
      components: [
        {
          type: "modal",
          title: "Beta Testing",
          body: [
            {
              type: "text",
              text: "Welcome to the beta testing program!",
            },
            {
              type: "button",
              label: "Start Testing",
              style: "primary",
              click: async () => await member.roles.add("1057991860439765073"),
            },
          ],
        },
      ],
    });
  },
};
