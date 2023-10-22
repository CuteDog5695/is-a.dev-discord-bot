const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        prid: String,
        activation_code: String,
        domain: String,
    },
    { collection: "activation" },
);

module.exports = mongoose.model("activation", userSchema);
