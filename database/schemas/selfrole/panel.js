const mongoose = require('mongoose');

const selfRolePanelSchema = mongoose.Schema({
    remarks: String,
    roleLimit: Number,
    requiredRoles: [{
        roleId: String,
    }],
    embed: Boolean,
    guildId: String,
    panelId: Number,
    messageId: String,
    channelId: String,
    roles: [{
        roleId: String,
        buttonId: String,
        buttonStyle: String,
        buttonType: String,
        buttonLabel: String,
        buttonEmoji: String,
        buttonEmojiAnimated: Boolean,
        buttonEmojiDefault: Boolean,
        
    }],
});

module.exports = mongoose.model('SelfRole.Panel', selfRolePanelSchema, 'selfrole.Panel');
