const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userid: String,
  maintainer: Boolean
}, { collection: 'maintainer' });

const Maintainers = mongoose.model('maintainer', userSchema);

module.exports = Maintainers;