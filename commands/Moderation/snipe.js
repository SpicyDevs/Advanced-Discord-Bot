const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const config = require("../../botconfig/config.js");
  const ee = require("../../botconfig/embed.js");
  const settings = require("../../botconfig/settings.js");

  
  module.exports = {
    name: "snipe",
    slashName: "snipe",
    category: "Moderation",
    aliases: [],
    description: "Snipes the last deleted message",
    cooldown: 1,
    memberpermissions: [PermissionFlagsBits.SendMessages],
    requiredroles: [],
    alloweduserids: [],
    options: [],
    usage: "",
    minargs: 0,
    maxargs: 0,
    minplusargs: 0,
    maxplusargs: 0,
    argsmissing_message: "",
    argstoomany_message: "",
    slashRun: async (client, interaction) => {
      try {

      } catch (e) {
        console.log(String(e.stack).bgRed);
      }
    },
    messageRun: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
      try {
        const msg = client.snipes.get(message.channel.id);
        if (!msg)
          return message.channel.send(
            "There are no deleted messages in this channel!"
          );

          const id = msg.author.id;
        const member = await message.guild.members.fetch(id);
            const authorAvatar = msg.author.displayAvatarURL({ dynamic: true });
            const content = msg.content;
          const date = msg.date;
const deletionTime = (Date.now() - date) / 1000; // Calculate the time elapsed in seconds

let deletionText;
if (deletionTime < 60) {
  deletionText = `${Math.floor(deletionTime)} seconds ago`;
} else if (deletionTime < 3600) {
  deletionText = `${Math.floor(deletionTime / 60)} minutes ago`;
} else if (deletionTime < 86400) {
  deletionText = `${Math.floor(deletionTime / 3600)} hours ago`;
} else {
  deletionText = `${Math.floor(deletionTime / 86400)} days ago`;
}

const embed = new EmbedBuilder()
  .setAuthor({ name: member.user.tag, iconURL: authorAvatar })
  .setDescription(content)
  .setColor(0x2b2c30)
  .setFooter({ text: `Deleted ${deletionText}` });


          if (msg.image) embed.setImage(msg.image);
          await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      } catch (e) {
        console.log(String(e.stack).bgRed);
      }
    },
  };
  