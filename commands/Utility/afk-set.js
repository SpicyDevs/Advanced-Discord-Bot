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
const AfkEntry = require("../../database/schemas/utility/afk.js");
module.exports = {
  name: "afk-set", //the command name for the Slash Command
  slashName: "afk-set", //the command name for the Slash Command
  category: "Utility",
  aliases: ["afk"], //the command aliases [OPTIONAL]
  description: "Changes your state to afk.", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [
    //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
    //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ]
    //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
    {
      String: {
        name: "reason",
        description: "Reason for going AFK",
        required: false,
      },
    }, //to use in the code: interacton.getString("ping_amount")
    //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
    //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
    //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
    //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    // {
    // 	"StringChoices": {
    // 		name: "what_ping",
    // 		description: "What Ping do you want to get?",
    // 		required: false,
    // 		choices: [
    // 			["Bot", "botping"],
    // 			["Discord Api", "api"]
    // 		]
    // 	}
    // }, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
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
      //things u can directly access in an interaction!
      const {
        member,
        channelId,
        guildId,
        applicationId,
        commandName,
        deferred,
        replied,
        ephemeral,
        options,
        id,
        createdTimestamp,
      } = interaction;
      const { guild } = member;
      //let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices
      //const StringOption = options.getString("what_ping"); //same as in StringChoices
      //let UserOption = options.getUser("OPTIONNAME");
      //let ChannelOption = options.getChannel("OPTIONNAME");
      //let RoleOption = options.getRole("OPTIONNAME");
      const askWhichAfk = new EmbedBuilder()
        .setColor(ee.color)
        .setTitle("Choose your AFK style from the buttons below.");

      const askMsgSend = await interaction.reply({
        embeds: [askWhichAfk],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("global")
              .setLabel("AFK in all servers (Mutuals)")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId("server")
              .setLabel("AFK only in this server")
              .setStyle(ButtonStyle.Success)
          ),
        ],
      });

      const filter = (i) => {
        return i.user.id === member.id;
      };

      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 15000,
      });

      collector.on("collect", async (i) => {
        if (i.customId === "global") {
          try {
            const afkData = await AfkEntry.findOne({ userID: member.id });

            if (afkData) {
              await interaction.editReply({
                content: "You are already AFK.",
                embeds: [],
                components: [],
              });
              collector.stop();
            } else {
              const reason =
                options.getString("reason") || "No reason provided.";
              const newAfkData = new AfkEntry({
                guilds: [{ guildID: guild.id }],
                isGlobalAfk: true,
                userID: member.id,
                reason: reason,
                timestamp: Date.now(),
              });

              await newAfkData.save();
            }
          } catch (err) {
            console.log(err);
          }

          await interaction.editReply({
            content: "Your AFK status has been set to global.",
            embeds: [],
            components: [],
          });
          collector.stop();
        }
        if (i.customId === "server") {
          try {
            const data = await AfkEntry.findOne({ userID: member.id });
            if (data) {
              await interaction.editReply({
                content: "You are already AFK.",
                embeds: [],
                components: [],
              });
              collector.stop();
            } else {
              const reason =
                options.getString("reason") || "No reason provided.";
              const afkData = new AfkEntry({
                guilds: [{ guildID: guild.id }],
                isGlobalAfk: false,
                userID: member.id,
                reason: reason,
                timestamp: Date.now(),
              });

              await afkData.save();
            }
          } catch (err) {
            console.log(err);
          }

          await askMsgSend.edit({
            content: "Your AFK status has been set to server.",
            embeds: [],
            components: [],
          });
          collector.stop();
        }
      });

      collector.on("end", async (collected) => {
        if (collected.size === 0) {
          await askMsgSend.delete();
        }
      });
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
      const askWhichAfk = new EmbedBuilder()
        .setColor(ee.color)
        .setTitle("Choose your AFK style from the buttons below.");

      const askMsgSend = await message.reply({
        embeds: [askWhichAfk],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("global")
              .setLabel("AFK in all servers (Mutuals)")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId("server")
              .setLabel("AFK only in this server")
              .setStyle(ButtonStyle.Success)
          ),
        ],
      });

      const filter = (interaction) => {
        return interaction.user.id === message.author.id;
      };

      const collector = message.channel.createMessageComponentCollector({
        filter,
        time: 15000,
      });

      collector.on("collect", async (interaction) => {
        if (interaction.customId === "global") {
          try {
            const afkData = await AfkEntry.findOne({
              userID: message.author.id,
            });

            if (afkData) {
              await askMsgSend.edit({
                content: "You are already AFK.",
                embeds: [],
                components: [],
              });
              collector.stop();
            } else {
              const reason = args.join(" ") || "No reason provided.";
              const newAfkData = new AfkEntry({
                guilds: [{ guildID: message.guild.id }],
                isGlobalAfk: true,
                userID: message.author.id,
                reason: reason,
                timestamp: Date.now(),
              });

              await newAfkData.save();
            }
          } catch (err) {
            console.log(err);
          }

          await askMsgSend.edit({
            content: "Your AFK status has been set to global.",
            embeds: [],
            components: [],
          });
          collector.stop();
        } else if (interaction.customId === "server") {
          try {
            const data = await AfkEntry.findOne({ userID: message.author.id });

            if (data) {
              await askMsgSend.edit({
                content: "You are already AFK.",
                embeds: [],
                components: [],
              });
              collector.stop();
            } else {
              const reason = args.join(" ") || "No reason provided.";
              const afkData = new AfkEntry({
                guilds: [{ guildID: message.guild.id }],
                isGlobalAfk: false,
                userID: message.author.id,
                reason: reason,
                timestamp: Date.now(),
              });

              await afkData.save();
            }
          } catch (err) {
            console.log(err);
          }

          await askMsgSend.edit({
            content: "Your AFK status has been set to server.",
            embeds: [],
            components: [],
          });
          collector.stop();
        }
      });

      collector.on("end", async (collected) => {
        if (collected.size === 0) {
          await askMsgSend.delete();
        }
      });
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};
