const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        userid: String,
        githubid: String,
        email: String,
        gittoken: String,
        betatester: Boolean,
        maintainer: Boolean,
    },
    { collection: "userdata" }
);

userSchema.methods.generateHash = function (input) {
    return bcrypt.hashSync(input, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validateToken = function (gittoken) {
    return bcrypt.compareSync(gittoken, this.gittoken);
};

module.exports = mongoose.model("userdata", userSchema);
