const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userid: String,
  githubid: String,
  email: String,
  gittoken: String,
  betatester: Boolean,
  maintainer: Boolean
}, { collection: 'userdata' });

const User = mongoose.model('userdata', userSchema);

module.exports = User;