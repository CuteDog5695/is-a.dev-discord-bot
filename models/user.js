const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    _id: String, // Discord ID
    githubUsername: String, // GitHub username
    githubAccessToken: String, // GitHub access token
    email: String, // Email
});

module.exports = mongoose.model("user", UserSchema, "user");
