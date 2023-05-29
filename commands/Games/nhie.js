const { EmbedBuilder } = require("discord.js");
const ee = require("../../botconfig/embed.js");
const { default: fetch } = require("node-fetch");
const config = require("../../botconfig/config.js");

module.exports = {
  name: "nhie", //the command name for the Slash Command
  slashName: "nhie", //the command name for the Slash Command
  category: "Games",
  aliases: [], //the command aliases [OPTIONAL]
  description: "Never have i ever", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [
    //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
    //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ]
    //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
    //{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: false }}, //to use in the code: interacton.getString("ping_amount")
    //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
    //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
    //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
    //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    {
      StringChoices: {
        name: "type",
        description: "the level of question",
        required: false,
        choices: [
          ["NSFW", "nsfw"],
          ["PG13", "pg13"],
          ["Casual", "normal"],
        ],
      },
    }, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  usage: "", //the Command usage [OPTIONAL]
  minargs: 0, // minimum args for the message, 0 == none [OPTIONAL]
  maxargs: 0, // maximum args for the message, 0 == none [OPTIONAL]
  minplusargs: 0, // minimum args for the message, splitted with "++" , 0 == none [OPTIONAL]
  maxplusargs: 0, // maximum args for the message, splitted with "++" , 0 == none [OPTIONAL]
  argsmissing_message: "", //Message if the user has not enough args / not enough plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
  argstoomany_message: "", //Message if the user has too many / not enough args / too many plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
  slashRun: async (client, interaction) => {
    try {
      await interaction.deferReply({
        ephemeral: false,
      });
      let ctg = interaction.options.getString("type") || "normal";
      let data = await fetch(`https://iamghosty.me/tod/nhie?type=${ctg}`).then(
        (res) => res.json()
      );
      let embed = new EmbedBuilder()
        .setColor(config.emptyColor)
        .setTitle("Never Have I Ever")
        .setDescription(`**${data.data}**`)
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
    try {
      let ctg = args[0] || "normal";
      let data = await fetch(`https://iamghosty.me/tod/nhie?type=${ctg}`).then(
        (res) => res.json()
      );
      let embed = new EmbedBuilder()
        .setColor(config.emptyColor)
        .setTitle("Never Have I Ever")
        .setDescription(`**${data.data}**`)
        .setTimestamp();
      message.reply({ embeds: [embed] });
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};
