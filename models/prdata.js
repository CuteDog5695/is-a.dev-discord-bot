const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        prid: String,
        merged: Boolean,    },
    { collection: "prdata" }
);

module.exports = mongoose.model("prdata", userSchema);
