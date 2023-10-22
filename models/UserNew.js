const mongoose = require('mongoose');
const { Schema } = mongoose;

const userNewSchema = new Schema({
  _id: String, // Change 'String' to the appropriate data type for _id
  githubUsername: String,
  email: String,
  githubAccessToken: String,
});

module.exports = mongoose.model('UserNew', userNewSchema);