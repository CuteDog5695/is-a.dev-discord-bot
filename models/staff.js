const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({
    _id: String, // Discord ID
});

module.exports = mongoose.model("staff", StaffSchema, "staff");
