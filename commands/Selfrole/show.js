const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
  StringSelectMenuBuilder,
  parseEmoji,
  formatEmoji,
} = require("discord.js");
const config = require("../../botconfig/config.js");
const ee = require("../../botconfig/embed.js");
const settings = require("../../botconfig/settings.js");
const selfRolePanelSchema = require("../../database/schemas/selfrole/panel.js");
const { set } = require("mongoose");
module.exports = {
  name: "selfrole show", //the command name for the Slash Command
  slashName: "show", //the command name for the Slash Command
  category: "Selfrole",
  aliases: ["srs"], //the command aliases [OPTIONAL]
  description: "Show selfrole panels so you can use them!", //the command description for Slash Command Overview
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
      //let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices
      //const StringOption = options.getString("what_ping"); //same as in StringChoices
      //let UserOption = options.getUser("OPTIONNAME");
      //let ChannelOption = options.getChannel("OPTIONNAME");
      //let RoleOption = options.getRole("OPTIONNAME");
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
      const guildData = await selfRolePanelSchema.find({
        guildId: message.guild.id,
      });
      if (!guildData || guildData.lenth === 0) {
        return message.reply(
          "There are no selfrole panels in this server! \n\n Create one using the `!selfrole create` command!"
        );
      }

      let datas_options = [];
      guildData.map(async (data) => {
        datas_options.push({
          label: data.remarks
            ? data.remarks
            : "No Remarks, Panel Id: " + data.panelId,
          value: data.remarks ? data.remarks : "PId" + data.panelId,
        });
      });
      const askWhichToShowEmbed = new EmbedBuilder()
        .setTitle(`Selfrole Panel Selector`)
        .setColor(ee.color)
        .setDescription(`Please select the selfrole panel you want to show!`);
      const ask_Edit = await message.reply({
        embeds: [askWhichToShowEmbed],
        allowedMentions: { repliedUser: false },
        components: [
          new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId("edit")
              .setPlaceholder("Select a selfrole panel to edit!")
              .addOptions(datas_options)
              .setMinValues(1)
              .setMaxValues(1)
          ),
        ],
      });
      const filter_ask_Edit = (i) => i.user.id === message.author.id;
      const collector_ask_Edit = ask_Edit.createMessageComponentCollector({
        filter: filter_ask_Edit,
        time: 30e3,
      });
      collector_ask_Edit.on("collect", async (i) => {
        await i.deferUpdate();
        await ask_Edit.delete().catch((e) => true);
        collector_ask_Edit.stop();
        const value = i.values[0].startsWith("PId")
          ? i.values[0].split("PId")[1]
          : i.values[0];
        let data = await selfRolePanelSchema.findOne({
          guildId: message.guild.id,
          remarks: value,
        });
        //0.01% chance that this happens xD
        if (!data) {
          data = await selfRolePanelSchema.findOne({
            guildId: message.guild.id,
            panelId: value,
          });
        }
        const whatToDoNowEmbedAsk = await message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Selfrole Panel Selector`)
              .setColor(ee.color)
              .setDescription(`What do you want to do with the selfrole panel?`)
              .addFields(
                {
                  name: `Remarks`,
                  value: `${data.remarks ? data.remarks : "No Remarks"}`,
                  inline: true,
                },
                {
                  name: `Selfroles`,
                  value: `${
                    data.roles.length > 0
                      ? data.roles.map((r) => `<@&${r.roleId}>`).join(", ")
                      : "No Selfroles"
                  }`,
                  inline: true,
                },
                {
                  name: `Panel Id`,
                  value: `${data.panelId}`,
                  inline: true,
                },
                {
                  name: `Embed`,
                  value: `${data.embed ? "Yes" : "No"}`,
                  inline: true,
                },
                {
                  name: `Role Limit`,
                  value: `${data.roleLimit ? data.roleLimit : "No Limit"}`,
                  inline: true,
                },
                {
                  name: `Required role`,
                  value: `${
                    data.requiredRoles.length > 0
                      ? data.requiredRoles
                          .map((r) => `<@&${r.roleId}>`)
                          .join(", ")
                      : "No requirments"
                  }`,
                  inline: true,
                }
              ),
          ],
          allowedMentions: { repliedUser: false },
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("publish")
                .setLabel("Publish")
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId("role-requirment")
                .setLabel("Edit Role Requirement")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("role-limit")
                .setLabel("Edit Role Limit")
                .setStyle(ButtonStyle.Primary),
              !data.embed
                ? new ButtonBuilder()
                    .setCustomId("embed")
                    .setLabel("Send as an Embed")
                    .setStyle(ButtonStyle.Secondary)
                : new ButtonBuilder()
                    .setCustomId("message")
                    .setLabel("Send as a Message")
                    .setStyle(ButtonStyle.Secondary)
            ),
          ],
        });
        const filter_whatToDoNowEmbedAsk = (i) =>
          i.user.id === message.author.id;
        const collector_whatToDoNowEmbedAsk =
          whatToDoNowEmbedAsk.createMessageComponentCollector({
            filter: filter_whatToDoNowEmbedAsk,
            time: 120e3,
          });
        collector_whatToDoNowEmbedAsk.on("collect", async (i) => {
          if (i.customId === "publish") {
            let selfroleMessage = `Interact with the buttons below to get the corresponding role(s). \n ${data.roles
              .map(
                (r) =>
                  `> ${
                    r.buttonEmojiDefault
                      ? r.buttonEmoji
                      : r.buttonEmoji
                      ? formatEmoji(r.buttonEmoji, r.buttonEmojiAnimated)
                      : r.buttonLabel
                  } -> <@&${r.roleId}>`
              )
              .join("\n ")}`;
            await i.deferUpdate();
            const ask = await i.message.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle(`Selfrole Panel Selector`)
                  .setColor(ee.color)
                  .setDescription(
                    `Do you want to **publish** the selfrole panel with the **default message?** \n\n **Default Message:** \n\n ${selfroleMessage}`
                  ),
              ],
              allowedMentions: { repliedUser: false },
              components: [
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId("yes")
                    .setLabel("Yes")
                    .setStyle(ButtonStyle.Success),
                  new ButtonBuilder()
                    .setCustomId("no")
                    .setLabel("No")
                    .setStyle(ButtonStyle.Danger)
                ),
              ],
            });
            const filter_ask = (x) => x.user.id === message.author.id;
            const collector_ask = ask.createMessageComponentCollector({
              filter: filter_ask,
              time: 30e3,
            });
            collector_ask.on("collect", async (x) => {
              if (x.customId === "yes") {
                await x.deferUpdate();
                await ask.delete().catch((e) => true);
                collector_ask.stop();
                let channel = message.guild.channels.cache.get(data.channelId);
                if (!channel) {
                  const noChannel = await message.reply({
                    embeds: [
                      new EmbedBuilder()
                        .setTitle(`Selfrole Panel Selector`)
                        .setColor(ee.wrongcolor)
                        .setDescription(
                          `The channel in which the selfrole panel was supposed to be sent was deleted or does not exist anymore. \n\n **Please mention a channel where you want to send the selfrole panel.**`
                        ),
                    ],
                    allowedMentions: { repliedUser: false },
                  });

                  const filter_channel = (ch) =>
                    ch.author.id === message.author.id;
                  const collector_channel =
                    message.channel.createMessageCollector({
                      filter: filter_channel,
                      time: 30e3,
                    });
                  collector_channel.on("collect", async (ch) => {
                    channel =
                      ch.mentions.channels.first() ||
                      message.guild.channels.cache.get(ch.content);
                    if (!channel) {
                      await ch.delete().catch((e) => true);
                      noChannel
                        .reply({
                          content: `Please mention a valid channel. \n\n **Please mention a channel where you want to send the selfrole panel.**`,
                        })
                        .then((msg) => {
                          setTimeout(() => {
                            msg.delete().catch((e) => true);
                          }, 5e3);
                        });
                      return;
                    } else {
                      data.channelId = channel.id;
                      await data.save();
                      await ch.delete().catch((e) => true);
                      noChannel.delete().catch((e) => true);
                      collector_channel.stop();
                      collector_whatToDoNowEmbedAsk.stop();
                      message.channel.send({
                        content: `**Successfully** setup the selfrole panel!`,
                      })
                      if (data.embed) {
                        message.guild.channels.cache
                          .get(data.channelId)
                          .send({
                            embeds: [
                              new EmbedBuilder()
                                .setColor(ee.color)
                                .setDescription(selfroleMessage),
                            ],
                            components: Array.from(
                              { length: Math.ceil(data.roles.length / 5) },
                              (_, i) =>
                                new ActionRowBuilder().addComponents(
                                  ...data.roles
                                    .slice(i * 5, i * 5 + 5)
                                    .map(
                                      ({
                                        buttonLabel,
                                        buttonType,
                                        buttonEmoji,
                                        buttonId,
                                        buttonStyle,
                                      }) =>{
                                        let xd = new ButtonBuilder()
                                          .setCustomId(
                                            buttonId
                                          ).setStyle(ButtonStyle[buttonStyle])
                                          if(buttonType === "label_only" || buttonType === "both") {
                                          xd.setLabel(buttonLabel)
                                          }
                                          if(buttonType === "emoji_only" || buttonType === "both") {
                                            xd.setEmoji(buttonEmoji)
                                          }
                                          return xd}
                                    )
                                )
                            ),
                          })
                          .then( async (msgId)=> { data.messageId = msgId.id; await data.save(); }).catch((e) => true);
                      } else {
                        message.guild.channels.cache
                          .get(data.channelId)
                          .send({
                            content: selfroleMessage,
                            components: Array.from(
                              { length: Math.ceil(data.roles.length / 5) },
                              (_, i) =>
                                new ActionRowBuilder().addComponents(
                                  ...data.roles
                                    .slice(i * 5, i * 5 + 5)
                                    .map(
                                      ({
                                        buttonLabel,
                                        buttonType,
                                        buttonEmoji,
                                        buttonId,
                                        buttonStyle,
                                      }) =>{
                                        let xd = new ButtonBuilder()
                                          .setCustomId(
                                            buttonId
                                          ).setStyle(ButtonStyle[buttonStyle])
                                          if(buttonType === "label_only" || buttonType === "both") {
                                          xd.setLabel(buttonLabel)
                                          }
                                          if(buttonType === "emoji_only" || buttonType === "both") {
                                            xd.setEmoji(buttonEmoji)
                                          }
                                          return xd}
                                    )
                                )
                            ),
                          })
                          .then( async (msgId)=> { data.messageId = msgId.id; await data.save(); }).catch((e) => true);
                      }
                    }
                  });
                  collector_channel.on("end", async (ch) => {
                    if (ch.size === 0) {
                      noChannel
                        .reply({
                          content: `You didn't mention a channel. \n\n **Please mention a channel where you want to send the selfrole panel.**`,
                        })
                        .then((msg) => {
                          setTimeout(() => {
                            msg.delete().catch((e) => true);
                          }, 5e3);
                        });
                    }
                    await noChannel.delete().catch((e) => true);
                    collector_whatToDoNowEmbedAsk.stop();
                  });
                } else {
                  collector_whatToDoNowEmbedAsk.stop();
                  message.channel.send({
                    content: `**Successfully** setup the selfrole panel!`,
                  })
                      if (data.embed) {
                        message.guild.channels.cache
                          .get(data.channelId)
                          .send({
                            embeds: [
                              new EmbedBuilder()
                                .setColor(ee.color)
                                .setDescription(selfroleMessage),
                            ],
                            components: Array.from(
                              { length: Math.ceil(data.roles.length / 5) },
                              (_, i) =>
                                new ActionRowBuilder().addComponents(
                                  ...data.roles
                                    .slice(i * 5, i * 5 + 5)
                                    .map(
                                      ({
                                        buttonLabel,
                                        buttonType,
                                        buttonEmoji,
                                        buttonId,
                                        buttonStyle,
                                      }) =>{
                                        let xd = new ButtonBuilder()
                                          .setCustomId(
                                            buttonId
                                          ).setStyle(ButtonStyle[buttonStyle])
                                          if(buttonType === "label_only" || buttonType === "both") {
                                          xd.setLabel(buttonLabel)
                                          }
                                          if(buttonType === "emoji_only" || buttonType === "both") {
                                            xd.setEmoji(buttonEmoji)
                                          }
                                          return xd}
                                    )
                                )
                            ),
                          })
                          .then( async (msgId)=> { data.messageId = msgId.id; await data.save(); }).catch((e) => true);
                      } else {
                        message.guild.channels.cache
                          .get(data.channelId)
                          .send({
                            content: selfroleMessage,
                            components: Array.from(
                              { length: Math.ceil(data.roles.length / 5) },
                              (_, i) =>
                                new ActionRowBuilder().addComponents(
                                  ...data.roles
                                    .slice(i * 5, i * 5 + 5)
                                    .map(
                                      ({
                                        buttonLabel,
                                        buttonType,
                                        buttonEmoji,
                                        buttonId,
                                        buttonStyle,
                                      }) =>{
                                        let xd = new ButtonBuilder()
                                          .setCustomId(
                                            buttonId
                                          ).setStyle(ButtonStyle[buttonStyle])
                                          if(buttonType === "label_only" || buttonType === "both") {
                                          xd.setLabel(buttonLabel)
                                          }
                                          if(buttonType === "emoji_only" || buttonType === "both") {
                                            xd.setEmoji(buttonEmoji)
                                          }
                                          return xd}
                                    )
                                )
                            ),
                          })
                          .then( async (msgId)=> { data.messageId = msgId.id; await data.save(); }).catch((e) => true);
                      }
                }
              } else if (x.customId === "no") {
                await x.deferUpdate();
                await ask.delete().catch((e) => true);
                collector_ask.stop();
                const defaultChangemsg = await message
                  .reply({
                    embeds: [
                      new EmbedBuilder()
                        .setTitle(`Selfrole Panel Selector`)
                        .setColor(ee.color)
                        .setDescription(
                          `Send the **message** you want to send in the channel! \n\n **Type \`cancel\` to cancel the setup!**`
                        ),
                    ],
                    allowedMentions: { repliedUser: false },
                  })
const filter_defaultChangemsg = (m) => m.author.id === message.author.id;
                const collector_defaultChangemsg = defaultChangemsg.channel.createMessageCollector({
                  filter: filter_defaultChangemsg,
                  time: 5 * 60 * 1000,
                  max: 1,
                });
                collector_defaultChangemsg.on("collect", async (msg) => {
                  let messagecontent = msg.content;
                  if (messagecontent.toLowerCase() === "cancel") {
                    collector_defaultChangemsg.stop();
                    return message.reply({
                      content: `**Successfully** cancelled the setup!`,
                    });
                  } else {
                    if(messagecontent.length > 2000) return message.reply({content: `Your Message is too long! Please make sure that the message is not longer than 2000 characters!`});
                    collector_defaultChangemsg.stop();

                  }
                  await msg.delete().catch((e) => true);
                })
                collector_defaultChangemsg.on("end", async (msg) => {
                  if (msg.size === 0) {
                    return message.reply({
                      content: `You didn't **sent** a message in time!`,
                    });
                  } else {
                    await defaultChangemsg.delete().catch((e) => true);
                    if(messagecontent.toLowerCase() === "cancel") return;
                    message.channel.send({
                      content: `**Successfully** setup the selfrole panel!`,
                    })
                    let channel = message.guild.channels.cache.get(data.channelId);
                    if (!channel) {
                      const noChannel = await message.reply({
                        embeds: [
                          new EmbedBuilder()
                            .setTitle(`Selfrole Panel Selector`)
                            .setColor(ee.wrongcolor)
                            .setDescription(
                              `The channel in which the selfrole panel was supposed to be sent was deleted or does not exist anymore. \n\n **Please mention a channel where you want to send the selfrole panel.**`
                            ),
                        ],
                        allowedMentions: { repliedUser: false },
                      });
    
                      const filter_channel = (ch) =>
                        ch.author.id === message.author.id;
                      const collector_channel =
                        message.channel.createMessageCollector({
                          filter: filter_channel,
                          time: 30e3,
                        });
                      collector_channel.on("collect", async (ch) => {
                        channel =
                          ch.mentions.channels.first() ||
                          message.guild.channels.cache.get(ch.content);
                        if (!channel) {
                          await ch.delete().catch((e) => true);
                          noChannel
                            .reply({
                              content: `Please mention a valid channel. \n\n **Please mention a channel where you want to send the selfrole panel.**`,
                            })
                            .then((msg) => {
                              setTimeout(() => {
                                msg.delete().catch((e) => true);
                              }, 5e3);
                            });
                          return;
                        } else {
                          data.channelId = channel.id;
                          await data.save();
                          await ch.delete().catch((e) => true);
                          noChannel.delete().catch((e) => true);
                          collector_channel.stop();
                          collector_whatToDoNowEmbedAsk.stop();
                          message.channel.send({
                            content: `**Successfully** setup the selfrole panel!`,
                          })
                          if (data.embed) {
                            message.guild.channels.cache
                              .get(data.channelId)
                              .send({
                                embeds: [
                                  new EmbedBuilder()
                                    .setColor(ee.color)
                                    .setDescription(selfroleMessage),
                                ],
                                components: Array.from(
                                  { length: Math.ceil(data.roles.length / 5) },
                                  (_, i) =>
                                    new ActionRowBuilder().addComponents(
                                      ...data.roles
                                        .slice(i * 5, i * 5 + 5)
                                        .map(
                                          ({
                                            buttonLabel,
                                            buttonType,
                                            buttonEmoji,
                                            buttonId,
                                            buttonStyle,
                                          }) =>{
                                            let xd = new ButtonBuilder()
                                              .setCustomId(
                                                buttonId
                                              ).setStyle(ButtonStyle[buttonStyle])
                                              if(buttonType === "label_only" || buttonType === "both") {
                                              xd.setLabel(buttonLabel)
                                              }
                                              if(buttonType === "emoji_only" || buttonType === "both") {
                                                xd.setEmoji(buttonEmoji)
                                              }
                                              return xd}
                                        )
                                    )
                                ),
                              })
                              .then( async (msgId)=> { data.messageId = msgId.id; await data.save(); }).catch((e) => true);
                          } else {
                            message.guild.channels.cache
                              .get(data.channelId)
                              .send({
                                content: selfroleMessage,
                                components: Array.from(
                                  { length: Math.ceil(data.roles.length / 5) },
                                  (_, i) =>
                                    new ActionRowBuilder().addComponents(
                                      ...data.roles
                                        .slice(i * 5, i * 5 + 5)
                                        .map(
                                          ({
                                            buttonLabel,
                                            buttonType,
                                            buttonEmoji,
                                            buttonId,
                                            buttonStyle,
                                          }) =>{
                                            let xd = new ButtonBuilder()
                                              .setCustomId(
                                                buttonId
                                              ).setStyle(ButtonStyle[buttonStyle])
                                              if(buttonType === "label_only" || buttonType === "both") {
                                              xd.setLabel(buttonLabel)
                                              }
                                              if(buttonType === "emoji_only" || buttonType === "both") {
                                                xd.setEmoji(buttonEmoji)
                                              }
                                              return xd}
                                        )
                                    )
                                ),
                              })
                              .then( async (msgId)=> { data.messageId = msgId.id; await data.save(); }).catch((e) => true);
                          }
                        }
                      });
                      collector_channel.on("end", async (ch) => {
                        if (ch.size === 0) {
                          noChannel
                            .reply({
                              content: `You didn't mention a channel. \n\n **Please mention a channel where you want to send the selfrole panel.**`,
                            })
                            .then((msg) => {
                              setTimeout(() => {
                                msg.delete().catch((e) => true);
                              }, 5e3);
                            });
                        }
                        await noChannel.delete().catch((e) => true);
                        collector_whatToDoNowEmbedAsk.stop();
                      });
                    } else {
                      collector_whatToDoNowEmbedAsk.stop();
                      message.channel.send({
                        content: `**Successfully** setup the selfrole panel!`,
                      })
                          if (data.embed) {
                            message.guild.channels.cache
                              .get(data.channelId)
                              .send({
                                embeds: [
                                  new EmbedBuilder()
                                    .setColor(ee.color)
                                    .setDescription(selfroleMessage),
                                ],
                                components: Array.from(
                                  { length: Math.ceil(data.roles.length / 5) },
                                  (_, i) =>
                                    new ActionRowBuilder().addComponents(
                                      ...data.roles
                                        .slice(i * 5, i * 5 + 5)
                                        .map(
                                          ({
                                            buttonLabel,
                                            buttonType,
                                            buttonEmoji,
                                            buttonId,
                                            buttonStyle,
                                          }) =>{
                                            let xd = new ButtonBuilder()
                                              .setCustomId(
                                                buttonId
                                              ).setStyle(ButtonStyle[buttonStyle])
                                              if(buttonType === "label_only" || buttonType === "both") {
                                              xd.setLabel(buttonLabel)
                                              }
                                              if(buttonType === "emoji_only" || buttonType === "both") {
                                                xd.setEmoji(buttonEmoji)
                                              }
                                              return xd}
                                        )
                                    )
                                ),
                              })
                              .then( async (msgId)=> { data.messageId = msgId.id; await data.save(); }).catch((e) => true);
                          } else {
                            message.guild.channels.cache
                              .get(data.channelId)
                              .send({
                                content: selfroleMessage,
                                components: Array.from(
                                  { length: Math.ceil(data.roles.length / 5) },
                                  (_, i) =>
                                    new ActionRowBuilder().addComponents(
                                      ...data.roles
                                        .slice(i * 5, i * 5 + 5)
                                        .map(
                                          ({
                                            buttonLabel,
                                            buttonType,
                                            buttonEmoji,
                                            buttonId,
                                            buttonStyle,
                                          }) =>{
                                            let xd = new ButtonBuilder()
                                              .setCustomId(
                                                buttonId
                                              ).setStyle(ButtonStyle[buttonStyle])
                                              if(buttonType === "label_only" || buttonType === "both") {
                                              xd.setLabel(buttonLabel)
                                              }
                                              if(buttonType === "emoji_only" || buttonType === "both") {
                                                xd.setEmoji(buttonEmoji)
                                              }
                                              return xd}
                                        )
                                    )
                                ),
                              })
                              .then( async (msgId)=> { data.messageId = msgId.id; await data.save(); }).catch((e) => true);
                          }
                    }
                  }
                });
              }
            });
            collector_ask.on("end", async (x) => {
              await ask.delete().catch((e) => true);
              collector_whatToDoNowEmbedAsk.stop();
              if(x.size === 0) return message.reply({content: `You didn't **reacted** in time!`})
            });
          }
          if (i.customId === "role-requirment") {
            await i.deferUpdate();
            const ask = await i.message.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle(`Selfrole Panel Selector`)
                  .setColor(ee.color)
                  .setDescription(
                    `What **role** do users need in order to access the reaction roles? \n Send \`cancel\` to cancel the command! \n\n **Current Requirments:** ${
                      data.requiredRoles.length > 0
                        ? data.requiredRoles
                            .map((r) => `<@&${r.roleId}>`)
                            .join(", ")
                        : "No requirments"
                    }`
                  ),
              ],
              allowedMentions: { repliedUser: false },
            });
            const filter_roleRequirment = (m) =>
              m.author.id === message.author.id;
            const collector_roleRequirment =
              message.channel.createMessageCollector({
                filter: filter_roleRequirment,
                time: 30e3,
              });
            collector_roleRequirment.on("collect", async (m) => {
              if (m.content.toLowerCase() === "cancel") {
                await ask.delete().catch((e) => true);
                await m.delete().catch((e) => true);
                await whatToDoNowEmbedAsk
                  .reply({
                    embeds: [
                      new EmbedBuilder()
                        .setTitle(`Selfrole Panel Selector`)
                        .setColor(ee.color)
                        .setDescription(`Successfully cancelled the command!`),
                    ],
                    allowedMentions: { repliedUser: false },
                  })
                  .then((msg) =>
                    setTimeout(() => msg.delete().catch((e) => true), 5e3)
                  );
                return collector_roleRequirment.stop();
              }
              const role =
                m.mentions.roles.first() ||
                message.guild.roles.cache.get(m.content);
              if (!role) {
                await m.delete().catch((e) => true);
                await whatToDoNowEmbedAsk
                  .reply({
                    embeds: [
                      new EmbedBuilder()
                        .setTitle(`Selfrole Panel Selector`)
                        .setColor(ee.color)
                        .setDescription(
                          `The role you provided is not a valid role!`
                        ),
                    ],
                    allowedMentions: { repliedUser: false },
                  })
                  .then((msg) =>
                    setTimeout(() => msg.delete().catch((e) => true), 5e3)
                  );
                return;
              }
              if (data.requiredRoles.find((r) => r.roleId === role.id)) {
                await m.delete().catch((e) => true);
                await whatToDoNowEmbedAsk.reply({
                  embeds: [
                    new EmbedBuilder()
                      .setTitle(`Selfrole Panel Selector`)
                      .setColor(ee.color)
                      .setDescription(
                        `The role you provided is already a requirement!`
                      ),
                  ],
                  allowedMentions: { repliedUser: false },
                });
                return;
              }
              await m.delete().catch((e) => true);
              await ask.delete().catch((e) => true);
              data.requiredRoles.push({ roleId: role.id });
              await data.save();
              whatToDoNowEmbedAsk
                .reply({
                  embeds: [
                    new EmbedBuilder()
                      .setTitle(`Selfrole Panel Selector`)
                      .setColor(ee.color)
                      .setDescription(
                        `Successfully added the role as a requirement!`
                      ),
                  ],
                  allowedMentions: { repliedUser: false },
                })
                .then((msg) =>
                  setTimeout(() => msg.delete().catch((e) => true), 5e3)
                );
              collector_roleRequirment.stop();
              await whatToDoNowEmbedAsk.edit({
                embeds: [
                  new EmbedBuilder()
                    .setTitle(`Selfrole Panel Selector`)
                    .setColor(ee.color)
                    .setDescription(
                      `What do you want to do with the selfrole panel?`
                    )
                    .addFields(
                      {
                        name: `Remarks`,
                        value: `${data.remarks ? data.remarks : "No Remarks"}`,
                        inline: true,
                      },
                      {
                        name: `Selfroles`,
                        value: `${
                          data.roles.length > 0
                            ? data.roles
                                .map((r) => `<@&${r.roleId}>`)
                                .join(", ")
                            : "No Selfroles"
                        }`,
                        inline: true,
                      },
                      {
                        name: `Panel Id`,
                        value: `${data.panelId}`,
                        inline: true,
                      },
                      {
                        name: `Embed`,
                        value: `${data.embed ? "Yes" : "No"}`,
                        inline: true,
                      },
                      {
                        name: `Role Limit`,
                        value: `${
                          data.roleLimit ? data.roleLimit : "No Limit"
                        }`,
                        inline: true,
                      },
                      {
                        name: `Required role`,
                        value: `${
                          data.requiredRoles.length > 0
                            ? data.requiredRoles
                                .map((r) => `<@&${r.roleId}>`)
                                .join(", ")
                            : "No requirments"
                        }`,
                        inline: true,
                      }
                    ),
                ],
                allowedMentions: { repliedUser: false },
              });
            });
          }
          if (i.customId === "role-limit") {
            await i.deferUpdate();
            const ask = await i.message.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle(`Selfrole Panel Selector`)
                  .setColor(ee.color)
                  .setDescription(
                    `How many **roles** should users be able to **get from the button role panel?** Send \`cancel\` to cancel the command! \n\n **Current Limit:** ${
                      data.roleLimit ? data.roleLimit : "No Limit"
                    }`
                  ),
              ],
              allowedMentions: { repliedUser: false },
            });
            const filter_roleLimit = (m) => m.author.id === message.author.id;
            const collector_roleLimit = message.channel.createMessageCollector({
              filter: filter_roleLimit,
              time: 30e3,
            });
            collector_roleLimit.on("collect", async (m) => {
              if (m.content.toLowerCase() === "cancel") {
                await ask.delete().catch((e) => true);
                await m.delete().catch((e) => true);
                whatToDoNowEmbedAsk
                  .reply({
                    content: `Successfully cancelled the command!`,
                    ephemeral: true,
                  })
                  .then((msg) =>
                    setTimeout(() => msg.delete().catch((e) => true), 5e3)
                  );
                collector_roleLimit.stop();
                return;
              }
              if (isNaN(m.content)) {
                await m.delete().catch((e) => true);
                whatToDoNowEmbedAsk
                  .reply({
                    content: `You didn't send a valid number!`,
                  })
                  .then((msg) =>
                    setTimeout(() => msg.delete().catch((e) => true), 5e3)
                  );
                return;
              }
              if (Number(m.content) < 0) {
                await m.delete().catch((e) => true);
                whatToDoNowEmbedAsk
                  .reply({
                    content: `Number can't be smaller than 0!`,
                  })
                  .then((msg) =>
                    setTimeout(() => msg.delete().catch((e) => true), 5e3)
                  );
                return;
              }
              if (Number(m.content) > data.roles.length) {
                await m.delete().catch((e) => true);
                whatToDoNowEmbedAsk
                  .reply({
                    content: `Number can't be bigger than the amount of roles!`,
                  })
                  .then((msg) =>
                    setTimeout(() => msg.delete().catch((e) => true), 5e3)
                  );
                return;
              }
              data.roleLimit = Number(m.content);
              await data.save();
              await m.delete().catch((e) => true);
              await ask.delete().catch((e) => true);
              whatToDoNowEmbedAsk
                .reply({
                  content: `Successfully set the role limit to \`${m.content}\`!`,
                  ephemeral: true,
                })
                .then((msg) =>
                  setTimeout(() => msg.delete().catch((e) => true), 5e3)
                );
              collector_roleLimit.stop();
              await whatToDoNowEmbedAsk.edit({
                embeds: [
                  new EmbedBuilder()
                    .setTitle(`Selfrole Panel Selector`)
                    .setColor(ee.color)
                    .setDescription(
                      `What do you want to do with the selfrole panel?`
                    )
                    .addFields(
                      {
                        name: `Remarks`,
                        value: `${data.remarks ? data.remarks : "No Remarks"}`,
                        inline: true,
                      },
                      {
                        name: `Selfroles`,
                        value: `${
                          data.roles.length > 0
                            ? data.roles
                                .map((r) => `<@&${r.roleId}>`)
                                .join(", ")
                            : "No Selfroles"
                        }`,
                        inline: true,
                      },
                      {
                        name: `Panel Id`,
                        value: `${data.panelId}`,
                        inline: true,
                      },
                      {
                        name: `Embed`,
                        value: `${data.embed ? "Yes" : "No"}`,
                        inline: true,
                      },
                      {
                        name: `Role Limit`,
                        value: `${
                          data.roleLimit ? data.roleLimit : "No Limit"
                        }`,
                        inline: true,
                      },
                      {
                        name: `Required role`,
                        value: `${
                          data.requiredRoles.length > 0
                            ? data.requiredRoles
                                .map((r) => `<@&${r.roleId}>`)
                                .join(", ")
                            : "No requirments"
                        }`,
                        inline: true,
                      }
                    ),
                ],
                allowedMentions: { repliedUser: false },
              });
            });
            collector_roleLimit.on("end", async (collected) => {});
          }
          if (i.customId === "embed") {
            data.embed = true;
            await data.save();
            i.reply({
              content: `Successfully set the selfrole panel to be sent as an embed!`,
              ephemeral: true,
            });
            await whatToDoNowEmbedAsk.edit({
              embeds: [
                new EmbedBuilder()
                  .setTitle(`Selfrole Panel Selector`)
                  .setColor(ee.color)
                  .setDescription(
                    `What do you want to do with the selfrole panel?`
                  )
                  .addFields(
                    {
                      name: `Remarks`,
                      value: `${data.remarks ? data.remarks : "No Remarks"}`,
                      inline: true,
                    },
                    {
                      name: `Selfroles`,
                      value: `${
                        data.roles.length > 0
                          ? data.roles.map((r) => `<@&${r.roleId}>`).join(", ")
                          : "No Selfroles"
                      }`,
                      inline: true,
                    },
                    {
                      name: `Panel Id`,
                      value: `${data.panelId}`,
                      inline: true,
                    },
                    {
                      name: `Embed`,
                      value: `${data.embed ? "Yes" : "No"}`,
                      inline: true,
                    },
                    {
                      name: `Role Limit`,
                      value: `${data.roleLimit ? data.roleLimit : "No Limit"}`,
                      inline: true,
                    },
                    {
                      name: `Required role`,
                      value: `${
                        data.requiredRoles.length > 0
                          ? data.requiredRoles
                              .map((r) => `<@&${r.roleId}>`)
                              .join(", ")
                          : "No requirments"
                      }`,
                      inline: true,
                    }
                  ),
              ],
              allowedMentions: { repliedUser: false },
              components: [
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId("publish")
                    .setLabel("Publish")
                    .setStyle(ButtonStyle.Success),
                  new ButtonBuilder()
                    .setCustomId("role-requirment")
                    .setLabel("Edit Role Requirement")
                    .setStyle(ButtonStyle.Primary),
                  new ButtonBuilder()
                    .setCustomId("role-limit")
                    .setLabel("Edit Role Limit")
                    .setStyle(ButtonStyle.Primary),
                  !data.embed
                    ? new ButtonBuilder()
                        .setCustomId("embed")
                        .setLabel("Send as an Embed")
                        .setStyle(ButtonStyle.Secondary)
                    : new ButtonBuilder()
                        .setCustomId("message")
                        .setLabel("Send as a Message")
                        .setStyle(ButtonStyle.Secondary)
                ),
              ],
            });
          }
          if (i.customId === "message") {
            data.embed = false;
            await data.save();
            i.reply({
              content: `Successfully set the selfrole panel to be sent as a message!`,
              ephemeral: true,
            });
            await whatToDoNowEmbedAsk.edit({
              embeds: [
                new EmbedBuilder()
                  .setTitle(`Selfrole Panel Selector`)
                  .setColor(ee.color)
                  .setDescription(
                    `What do you want to do with the selfrole panel?`
                  )
                  .addFields(
                    {
                      name: `Remarks`,
                      value: `${data.remarks ? data.remarks : "No Remarks"}`,
                      inline: true,
                    },
                    {
                      name: `Selfroles`,
                      value: `${
                        data.roles.length > 0
                          ? data.roles.map((r) => `<@&${r.roleId}>`).join(", ")
                          : "No Selfroles"
                      }`,
                      inline: true,
                    },
                    {
                      name: `Panel Id`,
                      value: `${data.panelId}`,
                      inline: true,
                    },
                    {
                      name: `Embed`,
                      value: `${data.embed ? "Yes" : "No"}`,
                      inline: true,
                    },
                    {
                      name: `Role Limit`,
                      value: `${data.roleLimit ? data.roleLimit : "No Limit"}`,
                      inline: true,
                    },
                    {
                      name: `Required role`,
                      value: `${
                        data.requiredRoles.length > 0
                          ? data.requiredRoles
                              .map((r) => `<@&${r.roleId}>`)
                              .join(", ")
                          : "No requirments"
                      }`,
                      inline: true,
                    }
                  ),
              ],
              allowedMentions: { repliedUser: false },
              components: [
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId("publish")
                    .setLabel("Publish")
                    .setStyle(ButtonStyle.Success),
                  new ButtonBuilder()
                    .setCustomId("role-requirment")
                    .setLabel("Edit Role Requirement")
                    .setStyle(ButtonStyle.Primary),
                  new ButtonBuilder()
                    .setCustomId("role-limit")
                    .setLabel("Edit Role Limit")
                    .setStyle(ButtonStyle.Primary),
                  !data.embed
                    ? new ButtonBuilder()
                        .setCustomId("embed")
                        .setLabel("Send as an Embed")
                        .setStyle(ButtonStyle.Secondary)
                    : new ButtonBuilder()
                        .setCustomId("message")
                        .setLabel("Send as a Message")
                        .setStyle(ButtonStyle.Secondary)
                ),
              ],
            });
          }
        });
        collector_whatToDoNowEmbedAsk.on("end", async (i) => {
          await whatToDoNowEmbedAsk.delete().catch((e) => true);
        });
      });
      collector_ask_Edit.on("end", async (i) => {
        await ask_Edit.delete().catch((e) => true);
      });
  },
};
