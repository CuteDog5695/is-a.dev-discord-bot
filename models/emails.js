const mongoose = require("mongoose");

const EmailSchema = new mongoose.Schema({
    _id: String, // Discord ID
    EmailCount: String,
    EmailOne: String,
    EmailTwo: String,
    DiscordID: String,
});

module.exports = mongoose.model("email", EmailSchema, "email");
