const { EmbedBuilder } = require("discord.js");
const { default: fetch } = require("node-fetch");
const config = require("../../botconfig/embed.js");

module.exports = {
  name: "wyr", //the command name for the Slash Command
  slashName: "wyr", //the command name for the Slash Command
  category: "Games",
  description: "Lets you get some nhie questions, NEVER HAVE I EVER.", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  slashRun: async (client, interaction) => {
    try {
      await interaction.deferReply();
      const fetched = await fetch(`https://iamghosty.me/tod/nhie`);
      const data = await fetched.json();
      //console.log(data)
      const embed = new EmbedBuilder()
        .setTitle(`Would you rather...`)
        .setDescription(`**${data.data}**`)
        .setColor(config.emptyColor)
        //.setFooter(`Requested by ${interaction.user.username}`)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
  messageRun: async (
    client,
    message,
    args,
    plusArgs,
    cmdUser,
    text,
    prefix
  ) => {
    const fetched = await fetch(`https://iamghosty.me/tod/wyr`);
    const data = await fetched.json();
    const embed1 = new EmbedBuilder()
      .setTitle(`Would you rather...`)
      .setDescription(`**${data.data}**`)
      .setColor(config.emptyColor)
      //.setFooter(`Requested by ${interaction.user.username}`)
      .setTimestamp();
    message.channel.send({ embeds: [embed1] });
  },
};
