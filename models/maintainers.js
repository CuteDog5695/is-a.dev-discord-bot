const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        userid: String,
        maintainer: Boolean,
    },
    { collection: "maintainer" }
);

module.exports = mongoose.model("maintainer", userSchema);
