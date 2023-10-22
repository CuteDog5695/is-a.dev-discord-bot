const ChooseEmail = require("./select/ChooseEmail");
module.exports = async function (interaction) {
    if (interaction.customId === "email") {
        await ChooseEmail(interaction);
    }
};