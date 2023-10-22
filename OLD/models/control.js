const mongoose = require("mongoose");

// William Keep out of this file, you don't need to touch it.

const userSchema = new mongoose.Schema(
    {
        DisableRegister: Boolean,
        fork: Boolean,
    },
    { collection: "controller" },
);

module.exports = mongoose.model("controller", userSchema);
