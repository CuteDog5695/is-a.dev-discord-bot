const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("beta").setDescription("Launches a modal"),
  async execute(interaction) {
    
    const member = interaction.member;

    const modal = ({
      content: "Please Wait!",
      components: [
        {
          type: "modal",
          title: "Beta Testing",
          body: [
            {
              type: "text",
              text: "Welcome to the beta testing program! By clicking the button below, you agree to the following terms and conditions:",
            },
            {
                type: "text",
                text: "1. Only use in command channels.",
            },
            {
                type: "text",
                text: "2. You will report any bugs you encounter.",

            },
            {
                type: "text",
                text: "3. You will not abuse any of the bot's features.",
            },
            {
                type: "text",
                text: "4. You will not use the bot to break any of the server's rules.",
            },
            {
                type: "text",
                text: "5. You will not use the bot to break any of Discord's Terms of Service.",
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
    await interaction.showModal(modal);
  },
};
