const Discord = require('discord.js');
module.exports = async (client, thread) => {

    if (thread.type === Discord.ChannelType.PublicThread) {
        thread.join();
    }

}

