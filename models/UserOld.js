const mongoose = require('mongoose');
const { Schema } = mongoose;

const userOldSchema = new Schema({
    userid: String,
    githubid: String,
    email: String,
    gittoken: String,
  });
  
  module.exports = mongoose.model('UserOld', userOldSchema);