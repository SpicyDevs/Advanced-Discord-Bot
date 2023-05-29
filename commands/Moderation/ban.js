const { Permissions } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Ban a user from the server',
    usage: '<@user> <reason>',
    permissions: [Permissions.FLAGS.BAN_MEMBERS],
    async execute(message, args) {
        const member = message.mentions.members.first();
        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (!member) {
            return message.reply('You need to mention the member you want to ban');
        }

        if (!member.bannable) {
            return message.reply('I cannot ban this user! Do they have a higher role? Do I have ban permissions?');
        }

        await member.ban({ reason })
            .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
        message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
    },
};
