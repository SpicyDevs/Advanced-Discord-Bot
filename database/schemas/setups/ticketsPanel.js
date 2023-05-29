const mongoose = require('mongoose');

const ticketPanelSchema = new mongoose.Schema({
    panelId: String,
    remarks: String,
    messageId: String,
    guildId: String,
    channelId: String,
    everyoneRoleId: String,
    supportRoles: [{
        roleId: String,
        ping: Boolean
    }],
    Transcripts: {
        enabled: Boolean,
        channelId: String,
        sendMember: Boolean,
        sendStaff: Boolean,
        sendLogs: Boolean
    },
    Multipletickets: Boolean,
    Options: [{
        name: String,
        description: String,
        emoji: String,
        categoryId: String,
        type: String,
        Button: {
            id: String
        }
    }]
});

module.exports = mongoose.model('ticketPanel', ticketPanelSchema);
