const mongoose = require("mongoose");

const EmailSchema = new mongoose.Schema({
    _id: String, // Discord ID
    DomainCount: String,
    emails: Array,
    EmailCount: String,
});

module.exports = mongoose.model("email", EmailSchema, "email");
