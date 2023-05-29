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
  name: "firstmessage", //the command name for the Slash Command
  slashName: "firstmessage", //the command name for the Slash Command
  category: "Utility",
  aliases: ["fm", "firstmsg"], //the command aliases [OPTIONAL]
  description: "Gets you the first message of the channel", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [
    //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
    //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ]
    //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
    //{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
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

      const msg = await interaction.channel.messages
        .fetch({ after: 1, limit: 1 })
        .catch((e) => {});
      if (!msg || msg.size !== 1)
        return interaction.reply({
          content: "Couldn't find the first message!",
          allowedMentions: { repliedUser: false },
        });

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: msg.first().author.tag,
              iconURL: msg.first().author.displayAvatarURL({ dynamic: true }),
            })
            .setDescription(String(`${msg.first().content}`))
            .addFields(
              {
                name: "Sent",
                value: `<t:${Math.floor(
                  msg.first().createdTimestamp / 1000
                )}:R>`,
                inline: true,
              },
              {
                name: "Message ID",
                value: `\`${msg.first().id}\``,
                inline: true,
              }
            )
            .setColor(ee.color)
            .setFooter({
              text: `Requested by ${message.author.tag}`,
              iconURL: ee.footerIcon,
            })
            .setTimestamp(),
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setStyle(ButtonStyle.Link)
              .setLabel("Jump to Message")
              .setURL(msg.first().url)
          ),
        ],
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
      const msg = await message.channel.messages
        .fetch({ after: 1, limit: 1 })
        .catch((e) => {});
      if (!msg || msg.size !== 1)
        return message.reply({
          content: "Couldn't find the first message!",
          allowedMentions: { repliedUser: false },
        });

      message.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: msg.first().author.tag,
              iconURL: msg.first().author.displayAvatarURL({ dynamic: true }),
            })
            .setDescription(String(`${msg.first().content}`))
            .addFields(
              {
                name: "Sent",
                value: `<t:${Math.floor(
                  msg.first().createdTimestamp / 1000
                )}:R>`,
                inline: true,
              },
              {
                name: "Message ID",
                value: `\`${msg.first().id}\``,
                inline: true,
              }
            )
            .setColor(ee.color)
            .setFooter({
              text: `Requested by ${message.author.tag}`,
              iconURL: ee.footerIcon,
            })
            .setTimestamp(),
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setStyle(ButtonStyle.Link)
              .setLabel("Jump to Message")
              .setURL(msg.first().url)
          ),
        ],
      });
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};
