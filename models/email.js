const mongoose = require("mongoose");

// William Keep out of this file, you don't need to touch it.

const userSchema = new mongoose.Schema(
    {
        domain: String,
        username: String,
        passkey: String,
        enabled: Boolean,

    },
    { collection: "email" }
);

module.exports = mongoose.model("email", userSchema);
