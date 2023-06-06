const { isADev } = require("./is-a-dev.js");
function GuildID(id) {
    if (isADev.guildID === id) {
        return isADev
    } else {
        return false
    }
}
module.exports = { GuildID }