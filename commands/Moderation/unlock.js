const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder,
    PermissionFlagsBits,
    PermissionsBitField
  } = require("discord.js");
  const config = require("../../botconfig/config.js");
  const ee = require("../../botconfig/embed.js");
  const settings = require("../../botconfig/settings.js");
  
  module.exports = {
    name: "unlock", // the command name for the Slash Command
    slashName: "unlock", // the command name for the Slash Command
    category: "Moderation",
    aliases: [], // the command aliases [OPTIONAL]
    description: "Sets the channel to allow everyone to send messages", // the command description [OPTIONAL]
    cooldown: 1,
    memberpermissions: [PermissionFlagsBits.ManageChannels], // Only allow members with Manage Channels permission to execute the command
    requiredroles: [], // Only allow specific users with a role to execute the command [OPTIONAL]
    alloweduserids: [], // Only allow specific users to execute the command [OPTIONAL]
    options: [
      { "Channel": { name: "channel", description: "The channel to Unlock", required: false } },
    ], // No options are required for this command
    usage: "", // the command usage [OPTIONAL]
    slashRun: async (client, interaction) => {
      try {
        let channel;
  
        channel = interaction.channel || interaction.options.getChannel("channel");
  
        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          SendMessages: true
        });
        const embed = new EmbedBuilder()
          .setTitle("Channel Unlocked Successfully!")
          .setDescription(`Channel \`${channel.name}\` (${channel.id}) \n\nUnlocked by ${interaction.member.user} (${interaction.member.user.tag})`);
  
        await interaction.reply({ embeds: [embed] });
      } catch (e) {
        console.log(String(e.stack).bgRed);
      }
    },
    messageRun: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
      try {
        let channel;
  
        if (args.length > 0) {
          const arg = args[0];
          channel = message.guild.channels.cache.get(arg) || message.mentions.channels.first();
        } else {
          channel = message.channel;
        }
  
        if (!channel) {
          // Handle case when the specified channel is not found
          return message.channel.send("Please provide a valid channel!");
        }
        await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
          SendMessages: true
        });
        const embed = new EmbedBuilder()
          .setTitle("Channel Unlocked Successfully!")
          .setDescription(`Channel \`${channel.name}\` (${channel.id}) \n\nUnlocked by ${message.author} (${message.author.tag})`);
  
        await message.reply({ embeds: [embed] });
  
      } catch (e) {
        console.log(String(e.stack).bgRed);
      }
    },
  };
  