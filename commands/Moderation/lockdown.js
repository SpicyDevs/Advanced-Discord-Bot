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
    name: "lockdown", // the command name for the Slash Command
    slashName: "lockdown", // the command name for the Slash Command
    category: "Moderation",
    aliases: [], // the command aliases [OPTIONAL]
    description: "Locks all channels of the server for a specific role or everyone if no role is specified.", // the command description [OPTIONAL]
    cooldown: 1,
    memberpermissions: [PermissionFlagsBits.ManageChannels], // Only allow members with Manage Channels permission to execute the command
    requiredroles: [], // Only allow specific users with a role to execute the command [OPTIONAL]
    alloweduserids: [], // Only allow specific users to execute the command [OPTIONAL]
    options: [
      {
        "Role": { name: "role", description: "The role to lock channels for", required: false }
      }
    ],
    usage: "", // the command usage [OPTIONAL]
    slashRun: async (client, interaction) => {
      try {
        const guild = interaction.guild;
        const roleArg = interaction.options.getRole("role");
        let role = guild.roles.everyone;
    
        if (roleArg) {
          role = roleArg;
        }
    
        const channels = guild.channels.cache;
        let allChannelsLocked = true;
    
        channels.forEach(async (channel) => {
          if (!channel.permissionsFor(role).has(PermissionFlagsBits.SendMessages)) {
            allChannelsLocked = false;
            await channel.permissionOverwrites.edit(role, { SendMessages: false });
          }
        });
    
        if (allChannelsLocked) {
          return interaction.reply("The server is already under lockdown.");
        }
    
        const roleName = role.name !== "@everyone" ? `@${role.name}` : "everyone";
    
        const embed = new EmbedBuilder()
          .setTitle("Server Locked Down Successfully!")
          .setDescription(`All channels have been locked for ${roleName}. Users cannot send messages.`);
    
        await interaction.reply({ embeds: [embed] });
      } catch (e) {
        console.log(String(e.stack).bgRed);
      }
    },
    messageRun: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
      try {
        const guild = message.guild;
        const roleArg = message.mentions.roles.first();
        let role = guild.roles.everyone;
    
        if (roleArg) {
          role = roleArg;
        }
    
        const channels = guild.channels.cache;
        let allChannelsLocked = true;
    
        channels.forEach(async (channel) => {

if (!channel.permissionsFor(role).has(PermissionFlagsBits.SendMessages)) {
            allChannelsLocked = false;
            await channel.permissionOverwrites.edit(role, { SendMessages: false });
          }
        });
    
        if (allChannelsLocked) {
          return message.reply("The server is already under lockdown.");
        }
    
        const roleName = role.name !== "@everyone" ? `@${role.name}` : "everyone";
    
        const embed = new EmbedBuilder()
          .setTitle("Server Locked Down Successfully!")
          .setDescription(`All channels have been locked for ${roleName}. Users cannot send messages.`);
    
        await message.reply({ embeds: [embed] });
    
      } catch (e) {
        console.log(String(e.stack).bgRed);
      }
    },    
  };
  