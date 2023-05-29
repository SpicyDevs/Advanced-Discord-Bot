const mongoose = require('mongoose');

const afkSchema = mongoose.Schema({
  guilds: [{
    guildID: String
  }],
  isGlobalAfk: Boolean,
  userID: String,
  reason: String,
  timestamp: Number,
});

module.exports = mongoose.model('AfkEntry', afkSchema);
