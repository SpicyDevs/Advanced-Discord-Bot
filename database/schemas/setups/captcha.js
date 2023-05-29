const mongoose = require("mongoose")

const captchaSchema = mongoose.Schema({
    guildID: String,
    channelID: String,
    roleID: String,
    dm: Boolean,
    enabled: Boolean,
    timeout: Number,
    attempts: Number,
    punishment: String,
});

module.exports = mongoose.model("Captcha", captchaSchema);
