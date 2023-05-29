const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder,
    PermissionFlagsBits
  } = require("discord.js");
  const config = require("../../botconfig/config.js");
  const ee = require("../../botconfig/embed.js");
  const settings = require("../../botconfig/settings.js");
  
  module.exports = {
    name: "nuke", // the command name for the Slash Command
    slashName: "nuke", // the command name for the Slash Command
    category: "Moderation",
    aliases: [], // the command aliases [OPTIONAL]
    description: "Deletes the current channel and creates a new channel with the same name, type, etc.",
    cooldown: 1,
    memberpermissions: [PermissionFlagsBits.ManageChannels], // Only allow members with Manage Channels permission to execute the command
    requiredroles: [], // Only allow specific users with a role to execute the command [OPTIONAL]
    alloweduserids: [], // Only allow specific users to execute the command [OPTIONAL]
    options: [], // No options are required for this command
    usage: "", // the command usage [OPTIONAL]
    slashRun: async (client, interaction) => {
      try {
        interaction.channel.clone().then(async (channel) => {
          channel.setPosition(interaction.channel.position).then(
              interaction.channel.delete()
          );
          await channel.send({ content: `Nuked by **${interaction.member.user.tag}**` });
        });

      } catch (e) {
        console.log(String(e.stack).bgRed);
      }
    },
    messageRun: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
      try {
        message.channel.clone().then(async (channel) => {
          channel.setPosition(message.channel.position).then(
            message.channel.delete()
          );
          await channel.send({ content: `Nuked by **${message.author.tag}**` });
        });

      } catch (e) {
        console.log(String(e.stack).bgRed);
      }
    },
  };
  