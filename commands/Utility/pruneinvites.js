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
  name: "pruneinvites", //the command name for the Slash Command
  slashName: "pruneinvites", //the command name for the Slash Command
  category: "Utility",
  aliases: ["invitesprune"], //the command aliases [OPTIONAL]
  description: "Deletes all the invites", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [PermissionFlagsBits.Administrator], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
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
      //let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices
      //const StringOption = options.getString("what_ping"); //same as in StringChoices
      //let UserOption = options.getUser("OPTIONNAME");
      //let ChannelOption = options.getChannel("OPTIONNAME");
      //let RoleOption = options.getRole("OPTIONNAME");
      interaction.guild.invites.fetch().then(async (invites) => {
        if (!invites.size || invites.size === 0) {
          return interaction.reply({
            content: "There are no invites in this server.",
            ephemeral: true,
          });
        }
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `This will delete all the invites in this server. Are you sure you want to do this? \n \`${invites.size}\` invites will be deleted.`
              )
              .setColor(ee.color)
              .setFooter({ text: ee.footertext, iconURL: ee.footericon })
              .setTimestamp(),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("yes")
                .setLabel("Delete")
                .setStyle(ButtonStyle.Danger),
              new ButtonBuilder()
                .setCustomId("no")
                .setLabel("Cancel")
                .setStyle(ButtonStyle.Secondary)
            ),
          ],
        });
        const filter = (i) => i.user.id === message.author.id;
        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          time: 15000,
        });
        collector.on("collect", async (i) => {
          if (i.customId === "yes") {
            await i.deferUpdate();
            await interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setDescription(`Deleted \`${invites.size}\` invites.`)
                  .setColor(ee.color)
                  .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                  .setTimestamp(),
              ],
              components: [],
            });
            invites.forEach((invite) => invite.delete().catch(() => {}));
          } else if (i.customId === "no") {
            await i.deferUpdate();
            await interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setDescription(`Canceled.`)
                  .setColor(ee.color)
                  .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                  .setTimestamp(),
              ],
              components: [],
            });
          }
        });
        collector.on("end", async (collected, reason) => {
          if (reason === "time") {
            await interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setDescription(`Canceled.`)
                  .setColor(ee.color)
                  .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                  .setTimestamp(),
              ],
              components: [],
            });
          }
        });
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
      message.guild.invites.fetch().then(async (invites) => {
        if (!invites.size || invites.size === 0) {
            return message.reply({
              content: "There are no invites in this server."
            }).then(msg => setTimeout(() => msg.delete().catch(e => {}), 5000));
          }
        const msg = await message.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `This will delete all the invites in this server. Are you sure you want to do this? \n \`${invites.size}\` invites will be deleted.`
              )
              .setColor(ee.color)
              .setFooter({ text: ee.footertext, iconURL: ee.footericon })
              .setTimestamp(),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("yes")
                .setLabel("Delete")
                .setStyle(ButtonStyle.Danger),
              new ButtonBuilder()
                .setCustomId("no")
                .setLabel("Cancel")
                .setStyle(ButtonStyle.Secondary)
            ),
          ],
        });
        const filter = (interaction) =>
          interaction.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({
          filter,
          time: 15000,
        });
        collector.on("collect", async (interaction) => {
          if (interaction.customId === "yes") {
            await interaction.deferUpdate();
            await msg.edit({
              embeds: [
                new EmbedBuilder()
                  .setDescription(`Deleted \`${invites.size}\` invites.`)
                  .setColor(ee.color)
                  .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                  .setTimestamp(),
              ],
              components: [],
            });
            invites.forEach((invite) => invite.delete().catch(() => {}));
          } else if (interaction.customId === "no") {
            await interaction.deferUpdate();
            await msg.edit({
              embeds: [
                new EmbedBuilder()
                  .setDescription(`Canceled.`)
                  .setColor(ee.color)
                  .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                  .setTimestamp(),
              ],
              components: [],
            });
          }
        });
        collector.on("end", async (collected, reason) => {
          if (reason === "time") {
            await msg.edit({
              embeds: [
                new EmbedBuilder()
                  .setDescription(`Canceled.`)
                  .setColor(ee.color)
                  .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                  .setTimestamp(),
              ],
              components: [],
            });
          }
        });
      });
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};
