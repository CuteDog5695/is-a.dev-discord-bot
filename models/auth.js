const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema({
    _id: String, // Discord ID
    uuid: String, // UUID
    loggedIn: Boolean, // Logged in
});

module.exports = mongoose.model("auth", AuthSchema, "auth");
