const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
  StringSelectMenuBuilder,
  parseEmoji,
} = require("discord.js");
const config = require("../../botconfig/config.js");
const ee = require("../../botconfig/embed.js");
const settings = require("../../botconfig/settings.js");
const selfRolePanelSchema = require("../../database/schemas/selfrole/panel.js");
const { generateCaptcha } = require("../../handlers/functions.js");
module.exports = {
  name: "selfrole create", //the command name for the Slash Command
  slashName: "create", //the command name for the Slash Command
  category: "Selfrole",
  aliases: ["src"], //the command aliases [OPTIONAL]
  description: "Create selfroles in your server", //the command description for Slash Command Overview
  cooldown: 10,
  memberpermissions: ["ManageRoles"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
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
      const checkIfDataExists = await selfRolePanelSchema.find({
        guildId: message.guild.id,
      });
      if (checkIfDataExists.length !== 0) {
        const askIdEditOrNewEmbed = new EmbedBuilder()
          .setTitle("Selfrole Creation")
          .setColor(ee.color)
          .setDescription(
            `Do you want to edit an existing selfrole panel or create a new one?`
          );
        const ask_EditOrNew = await message.reply({
          embeds: [askIdEditOrNewEmbed],
          allowedMentions: { repliedUser: false },
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("edit")
                .setLabel("Edit Existing")
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId("new")
                .setLabel("New Selfrole Panel")
                .setStyle(ButtonStyle.Success)
            ),
          ],
        });
        const filter_ask_NewOrEdit = (i) => i.user.id === message.author.id;
        const collector_ask_NewOrEdit =
          ask_EditOrNew.createMessageComponentCollector({
            filter: filter_ask_NewOrEdit,
            time: 30e3,
          });
        collector_ask_NewOrEdit.on("collect", async (i) => {
          if (i.customId === "edit") {
            await i.deferUpdate();
            await ask_EditOrNew.delete().catch((e) => true);
            collector_ask_NewOrEdit.stop();
            let datas_options = [];
            checkIfDataExists.map(async (data) => {
              datas_options.push({
                label: data.remarks
                  ? data.remarks
                  : "No Remarks, Panel Id: " + data.panelId,
                value: data.remarks ? data.remarks : "PId" + data.panelId,
              });
            });
            const askIdEditEmbed = new EmbedBuilder()
              .setTitle("Selfrole Creation")
              .setColor(ee.color)
              .setDescription(
                `Please select the selfrole panel you want to edit!`
              );
            const ask_Edit = await message.reply({
              embeds: [askIdEditEmbed],
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
            const collector_ask_Edit = ask_Edit.createMessageComponentCollector(
              {
                filter: filter_ask_Edit,
                time: 30e3,
              }
            );
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
              let label_ask = undefined,
                emoji_ask = undefined,
                role_ask = undefined,
                btn_ask = undefined;

              const btn_embed = new EmbedBuilder()
                .setTitle("Selfrole Creation")
                .setColor(ee.color)
                .setDescription(
                  "Should buttons display label only, emoji only or both? This action is irreversible!"
                )
                .setImage(
                  "https://media.discordapp.net/attachments/1111682190573588551/1111997300986892328/Nova.png"
                );

              const btn_ask_msg = await message.reply({
                embeds: [btn_embed],
                allowedMentions: { repliedUser: false },
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("emoji_only")
                      .setLabel("Emoji Only")
                      .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                      .setCustomId("label_only")
                      .setLabel("Label Only")
                      .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                      .setCustomId("both")
                      .setLabel("Label & Emoji")
                      .setStyle(ButtonStyle.Success)
                  ),
                ],
              });
              const filter_ask = (i) => i.user.id === message.author.id;
              const btn_ask_collector =
                btn_ask_msg.createMessageComponentCollector({
                  filter: filter_ask,
                  time: 15_000,
                });
              btn_ask_collector.on("collect", async (i) => {
                btn_ask = i.customId;
                await btn_ask_msg.delete();
                if (btn_ask === "label_only" || btn_ask === "both") {
                  const label_embed = new EmbedBuilder()
                    .setTitle("Selfrole Creation")
                    .setColor(ee.color)
                    .setDescription(
                      "What should be the label of the button? This action is irreversible!"
                    );
                  const label_msg = await message.channel.send({
                    embeds: [label_embed],
                  });
                  let label_ask_collector;
                  try {
                    label_ask_collector = await label_msg.channel.awaitMessages(
                      {
                        filter: (msg) => msg.author.id === message.author.id,
                        max: 1,
                        time: 15_000,
                        errors: ["time"],
                      }
                    );
                  } catch (e) {
                    return message.reply({
                      embeds: [
                        new EmbedBuilder()
                          .setDescription("❌ | You took too long to respond!")
                          .setColor(ee.wrongcolor),
                      ],
                    });
                  }
                  label_ask = label_ask_collector.first().content;
                  if (!label_ask) {
                    label_ask_collector.map(
                      async (msg) => await msg.delete().catch((e) => true)
                    );
                    return message
                      .reply({
                        embeds: [
                          new EmbedBuilder()

                            .setTitle("Selfrole Creation")
                            .setColor(ee.color)
                            .setDescription("❌ | You didn't provide a label!"),
                        ],
                        allowedMentions: { repliedUser: false },
                      })
                      .then((msg) =>
                        setTimeout(() => msg.delete().catch((e) => true), 10000)
                      );
                  }
                  await label_msg.delete().catch((e) => true);
                  label_ask_collector.map(
                    async (msg) => await msg.delete().catch((e) => true)
                  );
                }
                if (btn_ask === "emoji_only" || btn_ask === "both") {
                  const emoji_embed = new EmbedBuilder()
                    .setTitle("Selfrole Creation")
                    .setColor(ee.color)
                    .setDescription(
                      "What should be the emoji of the button? This action is irreversible!"
                    );
                  const emoji_msg = await message.channel.send({
                    embeds: [emoji_embed],
                  });
                  let emoji_ask_collector;
                  try {
                    emoji_ask_collector = await emoji_msg.channel.awaitMessages(
                      {
                        filter: (msg) => msg.author.id === message.author.id,
                        max: 1,
                        time: 15_000,
                        errors: ["time"],
                      }
                    );
                  } catch (e) {
                    return message.reply({
                      embeds: [
                        new EmbedBuilder()
                          .setDescription("❌ | You took too long to respond!")
                          .setColor(ee.wrongcolor),
                      ],
                    });
                  }
                  emoji_ask = parseEmoji(emoji_ask_collector.first().content);
                  if (!emoji_ask) {
                    emoji_ask_collector.map(
                      async (msg) => await msg.delete().catch((e) => true)
                    );
                    return message.reply({
                      embeds: [
                        new EmbedBuilder()

                          .setTitle("Selfrole Creation")
                          .setColor(ee.color)
                          .setDescription(
                            "❌ | You didn't provide an  valid emoji!"
                          ),
                      ],
                      allowedMentions: { repliedUser: false },
                    });
                  }
                  if (emoji_ask.id === undefined && emoji_ask.name.length > 2) {
                    emoji_ask_collector.map(
                      async (msg) => await msg.delete().catch((e) => true)
                    );
                    return message.reply({
                      embeds: [
                        new EmbedBuilder()

                          .setTitle("Selfrole Creation")
                          .setColor(ee.color)
                          .setDescription(
                            "❌ | I cant put more than 1 deafult emoji!"
                          ),
                      ],
                      allowedMentions: { repliedUser: false },
                    });
                  }
                  await emoji_msg.delete().catch((e) => true);
                  emoji_ask_collector.map(
                    async (msg) => await msg.delete().catch((e) => true)
                  );
                }
                const btn_ask_style_embed = new EmbedBuilder()
                  .setTitle("Selfrole Creation")
                  .setColor(ee.color)
                  .setDescription(
                    "What should be the style of the button? This action is irreversible!"
                  )
                  .setImage("https://i.imgur.com/mUbn7PJ.png");
                const btn_ask_style_msg = await message.channel.send({
                  embeds: [btn_ask_style_embed],

                  components: [
                    new ActionRowBuilder().addComponents(
                      new ButtonBuilder()
                        .setCustomId("Primary")
                        .setLabel("Button")
                        .setStyle(ButtonStyle.Primary),
                      new ButtonBuilder()
                        .setCustomId("Success")
                        .setLabel("Button")
                        .setStyle(ButtonStyle.Success),
                      new ButtonBuilder()
                        .setCustomId("Secondary")
                        .setLabel("Button")
                        .setStyle(ButtonStyle.Secondary),

                      new ButtonBuilder()
                        .setCustomId("Danger")
                        .setLabel("Button")
                        .setStyle(ButtonStyle.Danger)
                    ),
                  ],
                });
                let btn_ask_style_collector;
                try {
                  btn_ask_style_collector =
                    await btn_ask_style_msg.awaitMessageComponent({
                      filter: (interaction) =>
                        interaction.user.id === message.author.id,
                      time: 15_000,
                      errors: ["time"],
                    });
                } catch (e) {
                  await btn_ask_style_msg.delete();
                  return message.reply({
                    embeds: [
                      new EmbedBuilder()

                        .setDescription("❌ | You took too long to respond!")
                        .setColor(ee.wrongcolor),
                    ],
                  });
                }
                const btn_ask_style = btn_ask_style_collector.customId;
                await btn_ask_style_msg.delete();
                if (!btn_ask_style) {
                  return message
                    .reply({
                      embeds: [
                        new EmbedBuilder()
                          .setTitle("Selfrole Creation")
                          .setColor(ee.wrongcolor)
                          .setDescription("❌ | You didn't provide a style!"),
                      ],
                      allowedMentions: { repliedUser: false },
                    })
                    .then((msg) =>
                      setTimeout(() => msg.delete().catch((e) => true), 10000)
                    );
                }

                const role_embed = new EmbedBuilder()
                  .setTitle("Selfrole Creation")
                  .setColor(ee.color)
                  .setDescription(
                    "Mention the role that will be given when the button is clicked"
                  );
                const role_msg = await message.channel.send({
                  embeds: [role_embed],
                });
                let role_ask_collector;
                try {
                  role_ask_collector = await role_msg.channel.awaitMessages({
                    filter: (msg) => msg.author.id === message.author.id,
                    max: 1,
                    time: 15_000,
                    errors: ["time"],
                  });
                } catch (e) {
                  return message.reply({
                    embeds: [
                      new EmbedBuilder()
                        .setDescription("❌ | You took too long to respond!")
                        .setColor(ee.wrongcolor),
                    ],
                  });
                }
                role_ask =
                  role_ask_collector.first().mentions.roles.first() ||
                  message.guild.roles.cache.get(
                    role_ask_collector.first().content
                  );
                if (!role_ask) {
                  role_ask_collector.map(
                    async (msg) => await msg.delete().catch((e) => true)
                  );
                  return message.reply({
                    embeds: [
                      new EmbedBuilder()

                        .setTitle("Selfrole Creation")
                        .setColor(ee.color)
                        .setDescription("❌ | You didn't mention a role!"),
                    ],
                    allowedMentions: { repliedUser: false },
                  });
                }
                const role = role_ask.id;
                const role_name = role_ask.name;
                const role_position = role_ask.position;

                if (
                  role_position >=
                  message.guild.members.me.roles.highest.position
                ) {
                  role_ask_collector.map(
                    async (msg) => await msg.delete().catch((e) => true)
                  );
                  return message
                    .reply({
                      embeds: [
                        new EmbedBuilder()

                          .setTitle("Selfrole Creation")
                          .setColor(ee.color)
                          .setDescription(
                            "❌ | I cant give you a role higher than mine! \n\n Resting run the command again and choose a role below my highest role!"
                          ),
                      ],
                      allowedMentions: { repliedUser: false },
                    })
                    .then((msg) =>
                      setTimeout(() => msg.delete().catch((e) => true), 10000)
                    );
                }
                role_ask_collector.map(
                  async (msg) => await msg.delete().catch((e) => true)
                );
                await role_msg.delete().catch((e) => true);
                const done_embed = new EmbedBuilder()

                  .setTitle("Selfrole Creation")
                  .setColor(ee.color)
                  .setDescription(
                    "Selfrole created successfully! Use them by using the `!selfrole show` command"
                  );
                const done_msg = await message.channel.send({
                  embeds: [done_embed],
                });
                data.roles.push({
                  roleId: role,
                  buttonId: `selfrole.${message.guild.id}.${generateCaptcha(
                    4
                  )}`,
                  buttonStyle: btn_ask_style,
                  buttonType: btn_ask,
                  buttonLabel: label_ask || null,
                  buttonEmoji: emoji_ask
                    ? emoji_ask?.id
                      ? emoji_ask.id
                      : emoji_ask.name
                    : null,
                  buttonEmojiAnimated: emoji_ask?.animated || false,
                  buttonEmojiDefault: emoji_ask
                    ? emoji_ask.id
                      ? false
                      : true
                    : false,
                });
                await data.save();
              });
              btn_ask_collector.on("end", async (collected, reason) => {
                if (reason === "time" || collected.size === 0) {
                  await btn_ask_msg.delete().catch((e) => true);
                  return message.reply({
                    embeds: [
                      new EmbedBuilder()
                        .setDescription("❌ | You took too long to respond!")
                        .setColor(ee.wrongcolor),
                    ],
                  });
                }
              });
            });
            collector_ask_Edit.on("end", async (i) => {
              if (i.size === 0) {
                const noResultEmbed = new EmbedBuilder()
                  .setTitle("Selfrole Creation")
                  .setColor(ee.color)
                  .setDescription(
                    `You didn't react in time! Please try again!`
                  );
                ask_Edit.edit({
                  embeds: [noResultEmbed],
                  allowedMentions: { repliedUser: false },
                  components: [],
                });
              }
            });
          }
          if (i.customId === "new") {
            await i.deferUpdate();
            await ask_EditOrNew.delete().catch((e) => true);
            collector_ask_NewOrEdit.stop();
            let label_ask = undefined,
              emoji_ask = undefined,
              role_ask = undefined,
              btn_ask = undefined,
              remarks_ask = undefined;

            const btn_embed = new EmbedBuilder()
              .setTitle("Selfrole Creation")
              .setColor(ee.color)
              .setDescription(
                "Should buttons display label only, emoji only or both? This action is irreversible!"
              )
              .setImage(
                "https://cdn.discordapp.com/attachments/1109065674736816138/1111594608175095828/image.png"
              );

            const btn_ask_msg = await message.reply({
              embeds: [btn_embed],
              allowedMentions: { repliedUser: false },
              components: [
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId("label_only")
                    .setLabel("Label Only")
                    .setStyle(ButtonStyle.Success),
                  new ButtonBuilder()
                    .setCustomId("emoji_only")
                    .setLabel("Emoji Only")
                    .setStyle(ButtonStyle.Success),
                  new ButtonBuilder()
                    .setCustomId("both")
                    .setLabel("Label & Emoji")
                    .setStyle(ButtonStyle.Success)
                ),
              ],
            });
            const filter_ask = (i) => i.user.id === message.author.id;
            const btn_ask_collector =
              btn_ask_msg.createMessageComponentCollector({
                filter: filter_ask,
                time: 15_000,
              });
            btn_ask_collector.on("collect", async (i) => {
              btn_ask = i.customId;
              await btn_ask_msg.delete();
              if (btn_ask === "label_only" || btn_ask === "both") {
                const label_embed = new EmbedBuilder()
                  .setTitle("Selfrole Creation")
                  .setColor(ee.color)
                  .setDescription(
                    "What should be the label of the button? This action is irreversible!"
                  );
                const label_msg = await message.channel.send({
                  embeds: [label_embed],
                });
                let label_ask_collector;
                try {
                  label_ask_collector = await label_msg.channel.awaitMessages({
                    filter: (msg) => msg.author.id === message.author.id,
                    max: 1,
                    time: 15_000,
                    errors: ["time"],
                  });
                } catch (e) {
                  return message.reply({
                    embeds: [
                      new EmbedBuilder()
                        .setDescription("❌ | You took too long to respond!")
                        .setColor(ee.wrongcolor),
                    ],
                  });
                }
                label_ask = label_ask_collector.first().content;
                if (!label_ask) {
                  label_ask_collector.map(
                    async (msg) => await msg.delete().catch((e) => true)
                  );
                  return message
                    .reply({
                      embeds: [
                        new EmbedBuilder()

                          .setTitle("Selfrole Creation")
                          .setColor(ee.color)
                          .setDescription("❌ | You didn't provide a label!"),
                      ],
                      allowedMentions: { repliedUser: false },
                    })
                    .then((msg) =>
                      setTimeout(() => msg.delete().catch((e) => true), 10000)
                    );
                }
                await label_msg.delete().catch((e) => true);
                label_ask_collector.map(
                  async (msg) => await msg.delete().catch((e) => true)
                );
              }
              if (btn_ask === "emoji_only" || btn_ask === "both") {
                const emoji_embed = new EmbedBuilder()
                  .setTitle("Selfrole Creation")
                  .setColor(ee.color)
                  .setDescription(
                    "What should be the emoji of the button? This action is irreversible!"
                  );
                const emoji_msg = await message.channel.send({
                  embeds: [emoji_embed],
                });
                let emoji_ask_collector;
                try {
                  emoji_ask_collector = await emoji_msg.channel.awaitMessages({
                    filter: (msg) => msg.author.id === message.author.id,
                    max: 1,
                    time: 15_000,
                    errors: ["time"],
                  });
                } catch (e) {
                  return message.reply({
                    embeds: [
                      new EmbedBuilder()
                        .setDescription("❌ | You took too long to respond!")
                        .setColor(ee.wrongcolor),
                    ],
                  });
                }
                emoji_ask = parseEmoji(emoji_ask_collector.first().content);
                if (!emoji_ask) {
                  emoji_ask_collector.map(
                    async (msg) => await msg.delete().catch((e) => true)
                  );
                  return message.reply({
                    embeds: [
                      new EmbedBuilder()

                        .setTitle("Selfrole Creation")
                        .setColor(ee.color)
                        .setDescription(
                          "❌ | You didn't provide an  valid emoji!"
                        ),
                    ],
                    allowedMentions: { repliedUser: false },
                  });
                }
                if (emoji_ask.id === undefined && emoji_ask.name.length > 2) {
                  emoji_ask_collector.map(
                    async (msg) => await msg.delete().catch((e) => true)
                  );
                  return message.reply({
                    embeds: [
                      new EmbedBuilder()

                        .setTitle("Selfrole Creation")
                        .setColor(ee.color)
                        .setDescription(
                          "❌ | I cant put more than 1 deafult emoji!"
                        ),
                    ],
                    allowedMentions: { repliedUser: false },
                  });
                }
                await emoji_msg.delete().catch((e) => true);
                emoji_ask_collector.map(
                  async (msg) => await msg.delete().catch((e) => true)
                );
              }
              const btn_ask_style_embed = new EmbedBuilder()
                .setTitle("Selfrole Creation")
                .setColor(ee.color)
                .setDescription(
                  "What should be the style of the button? This action is irreversible!"
                )
                .setImage("https://i.imgur.com/mUbn7PJ.png");
              const btn_ask_style_msg = await message.channel.send({
                embeds: [btn_ask_style_embed],

                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("primary")
                      .setLabel("Button")
                      .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                      .setCustomId("Success")
                      .setLabel("Button")
                      .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                      .setCustomId("Secondary")
                      .setLabel("Button")
                      .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                      .setCustomId("Danger")
                      .setLabel("Button")
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
              let btn_ask_style_collector;
              try {
                btn_ask_style_collector =
                  await btn_ask_style_msg.awaitMessageComponent({
                    filter: (interaction) =>
                      interaction.user.id === message.author.id,
                    time: 15_000,
                    errors: ["time"],
                  });
              } catch (e) {
                await btn_ask_style_msg.delete();
                return message.reply({
                  embeds: [
                    new EmbedBuilder()

                      .setDescription("❌ | You took too long to respond!")
                      .setColor(ee.wrongcolor),
                  ],
                });
              }
              const btn_ask_style = btn_ask_style_collector.customId;
              await btn_ask_style_msg.delete();
              if (!btn_ask_style) {
                return message
                  .reply({
                    embeds: [
                      new EmbedBuilder()
                        .setTitle("Selfrole Creation")
                        .setColor(ee.wrongcolor)
                        .setDescription("❌ | You didn't provide a style!"),
                    ],
                    allowedMentions: { repliedUser: false },
                  })
                  .then((msg) =>
                    setTimeout(() => msg.delete().catch((e) => true), 10000)
                  );
              }

              const role_embed = new EmbedBuilder()
                .setTitle("Selfrole Creation")
                .setColor(ee.color)
                .setDescription(
                  "Mention the role that will be given when the button is clicked"
                );
              const role_msg = await message.channel.send({
                embeds: [role_embed],
              });
              let role_ask_collector;
              try {
                role_ask_collector = await role_msg.channel.awaitMessages({
                  filter: (msg) => msg.author.id === message.author.id,
                  max: 1,
                  time: 15_000,
                  errors: ["time"],
                });
              } catch (e) {
                return message.reply({
                  embeds: [
                    new EmbedBuilder()
                      .setDescription("❌ | You took too long to respond!")
                      .setColor(ee.wrongcolor),
                  ],
                });
              }
              role_ask =
                role_ask_collector.first().mentions.roles.first() ||
                message.guild.roles.cache.get(
                  role_ask_collector.first().content
                );
              if (!role_ask) {
                role_ask_collector.map(
                  async (msg) => await msg.delete().catch((e) => true)
                );
                return message.reply({
                  embeds: [
                    new EmbedBuilder()

                      .setTitle("Selfrole Creation")
                      .setColor(ee.color)
                      .setDescription("❌ | You didn't mention a role!"),
                  ],
                  allowedMentions: { repliedUser: false },
                });
              }
              const role = role_ask.id;
              const role_name = role_ask.name;
              const role_position = role_ask.position;

              if (
                role_position >= message.guild.members.me.roles.highest.position
              ) {
                role_ask_collector.map(
                  async (msg) => await msg.delete().catch((e) => true)
                );
                return message
                  .reply({
                    embeds: [
                      new EmbedBuilder()

                        .setTitle("Selfrole Creation")
                        .setColor(ee.color)
                        .setDescription(
                          "❌ | I cant give you a role higher than mine! \n\n Resting run the command again and choose a role below my highest role!"
                        ),
                    ],
                    allowedMentions: { repliedUser: false },
                  })
                  .then((msg) =>
                    setTimeout(() => msg.delete().catch((e) => true), 10000)
                  );
              }
              role_ask_collector.map(
                async (msg) => await msg.delete().catch((e) => true)
              );
              await role_msg.delete().catch((e) => true);
              const remarks_ask_embed = new EmbedBuilder()
                .setTitle("Selfrole Creation")
                .setColor(ee.color)
                .setDescription(
                  "What should be the remarks of the button? This action is irreversible! \n\n **Example:** `ping-roles`, `color-roles` \n\n **Note:** This will later help you idenify the panel in the `!selfrole show` command or when you want to delete it or adding more roles to it!"
                );
              const remarks_ask_msg = await message.channel.send({
                embeds: [remarks_ask_embed],
              });
              let remarks_ask_collector;
              try {
                remarks_ask_collector =
                  await remarks_ask_msg.channel.awaitMessages({
                    filter: (msg) => msg.author.id === message.author.id,
                    max: 1,
                    time: 15_000,
                    errors: ["time"],
                  });
              } catch (e) {
                return message.reply({
                  embeds: [
                    new EmbedBuilder()
                      .setDescription("❌ | You took too long to respond!")
                      .setColor(ee.wrongcolor),
                  ],
                });
              }
              remarks_ask = remarks_ask_collector.first().content;
              if (!remarks_ask) {
                remarks_ask_collector.map(
                  async (msg) => await msg.delete().catch((e) => true)
                );
                return message.reply({
                  embeds: [
                    new EmbedBuilder()
                      .setDescription("❌ | You didn't provide a remarks!")
                      .setColor(ee.wrongcolor),
                  ],
                  allowedMentions: { repliedUser: false },
                });
              }
              remarks_ask_collector.map(
                async (msg) => await msg.delete().catch((e) => true)
              );
              await remarks_ask_msg.delete().catch((e) => true);
              const done_embed = new EmbedBuilder()

                .setTitle("Selfrole Creation")
                .setColor(ee.color)
                .setDescription(
                  "Selfrole created successfully! Use them by using the `!selfrole show` command"
                );
              const done_msg = await message.channel.send({
                embeds: [done_embed],
              });

              let data = await selfRolePanelSchema.find({
                guildId: message.guild.id,
              });
              if (!data || data.length == 0) {
                data = new selfRolePanelSchema({
                  remarks: remarks_ask,
                  roleLimit: undefined,
                  requiredRoles: [],
                  embed: true,
                  guildId: message.guild.id,
                  panelId: data.length + 1,
                  messageId: undefined,
                  channelId: undefined,
                  roles: [],
                });
              } else if (data && data.length >= 1) {
                data = new selfRolePanelSchema({
                  remarks: remarks_ask,
                  roleLimit: undefined,
                  requiredRoles: [],
                  embed: true,
                  guildId: message.guild.id,
                  panelId: data.length + 1,
                  messageId: undefined,
                  channelId: undefined,
                  roles: [],
                });
              }
              data.roles.push({
                roleId: role,
                buttonId: `selfrole.${message.guild.id}.${generateCaptcha(4)}`,
                buttonStyle: btn_ask_style,
                buttonType: btn_ask,
                buttonLabel: label_ask || null,
                buttonEmoji: emoji_ask
                  ? emoji_ask?.id
                    ? emoji_ask.id
                    : emoji_ask.name
                  : null,
                buttonEmojiAnimated: emoji_ask?.animated || false,
                buttonEmojiDefault: emoji_ask
                  ? emoji_ask.id
                    ? false
                    : true
                  : false,
              });
              await data.save();
            });
            btn_ask_collector.on("end", async (collected, reason) => {
              if (reason === "time" || collected.size === 0) {
                await btn_ask_msg.delete().catch((e) => true);
                return message.reply({
                  embeds: [
                    new EmbedBuilder()
                      .setDescription("❌ | You took too long to respond!")
                      .setColor(ee.wrongcolor),
                  ],
                });
              }
            });
          }
        });
        collector_ask_NewOrEdit.on("end", async (i) => {
          if (i.size === 0) {
            const noResultEmbed = new EmbedBuilder()
              .setTitle("Selfrole Creation")
              .setColor(ee.color)
              .setDescription(`You didn't react in time! Please try again!`);
            ask_EditOrNew.edit({
              embeds: [noResultEmbed],
              allowedMentions: { repliedUser: false },
              components: [],
            });
          }
        });
      } else {
        let label_ask = undefined,
          emoji_ask = undefined,
          role_ask = undefined,
          btn_ask = undefined,
          remarks_ask = undefined;

        const btn_embed = new EmbedBuilder()
          .setTitle("Selfrole Creation")
          .setColor(ee.color)
          .setDescription(
            "Should buttons display label only, emoji only or both? This action is irreversible!"
          )
          .setImage(
            "https://cdn.discordapp.com/attachments/1109065674736816138/1111594608175095828/image.png"
          );

        const btn_ask_msg = await message.reply({
          embeds: [btn_embed],
          allowedMentions: { repliedUser: false },
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("label_only")
                .setLabel("Label Only")
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId("emoji_only")
                .setLabel("Emoji Only")
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId("both")
                .setLabel("Label & Emoji")
                .setStyle(ButtonStyle.Success)
            ),
          ],
        });
        const filter_ask = (i) => i.user.id === message.author.id;
        const btn_ask_collector = btn_ask_msg.createMessageComponentCollector({
          filter: filter_ask,
          time: 15_000,
        });
        btn_ask_collector.on("collect", async (i) => {
          btn_ask = i.customId;
          await btn_ask_msg.delete();
          if (btn_ask === "label_only" || btn_ask === "both") {
            const label_embed = new EmbedBuilder()
              .setTitle("Selfrole Creation")
              .setColor(ee.color)
              .setDescription(
                "What should be the label of the button? This action is irreversible!"
              );
            const label_msg = await message.channel.send({
              embeds: [label_embed],
            });
            let label_ask_collector;
            try {
              label_ask_collector = await label_msg.channel.awaitMessages({
                filter: (msg) => msg.author.id === message.author.id,
                max: 1,
                time: 15_000,
                errors: ["time"],
              });
            } catch (e) {
              return message.reply({
                embeds: [
                  new EmbedBuilder()
                    .setDescription("❌ | You took too long to respond!")
                    .setColor(ee.wrongcolor),
                ],
              });
            }
            label_ask = label_ask_collector.first().content;
            if (!label_ask) {
              label_ask_collector.map(
                async (msg) => await msg.delete().catch((e) => true)
              );
              return message
                .reply({
                  embeds: [
                    new EmbedBuilder()

                      .setTitle("Selfrole Creation")
                      .setColor(ee.color)
                      .setDescription("❌ | You didn't provide a label!"),
                  ],
                  allowedMentions: { repliedUser: false },
                })
                .then((msg) =>
                  setTimeout(() => msg.delete().catch((e) => true), 10000)
                );
            }
            await label_msg.delete().catch((e) => true);
            label_ask_collector.map(
              async (msg) => await msg.delete().catch((e) => true)
            );
          }
          if (btn_ask === "emoji_only" || btn_ask === "both") {
            const emoji_embed = new EmbedBuilder()
              .setTitle("Selfrole Creation")
              .setColor(ee.color)
              .setDescription(
                "What should be the emoji of the button? This action is irreversible!"
              );
            const emoji_msg = await message.channel.send({
              embeds: [emoji_embed],
            });
            let emoji_ask_collector;
            try {
              emoji_ask_collector = await emoji_msg.channel.awaitMessages({
                filter: (msg) => msg.author.id === message.author.id,
                max: 1,
                time: 15_000,
                errors: ["time"],
              });
            } catch (e) {
              return message.reply({
                embeds: [
                  new EmbedBuilder()
                    .setDescription("❌ | You took too long to respond!")
                    .setColor(ee.wrongcolor),
                ],
              });
            }
            emoji_ask = parseEmoji(emoji_ask_collector.first().content);
            if (!emoji_ask) {
              emoji_ask_collector.map(
                async (msg) => await msg.delete().catch((e) => true)
              );
              return message.reply({
                embeds: [
                  new EmbedBuilder()

                    .setTitle("Selfrole Creation")
                    .setColor(ee.color)
                    .setDescription("❌ | You didn't provide an  valid emoji!"),
                ],
                allowedMentions: { repliedUser: false },
              });
            }
            if (emoji_ask.id === undefined && emoji_ask.name.length > 2) {
              emoji_ask_collector.map(
                async (msg) => await msg.delete().catch((e) => true)
              );
              return message.reply({
                embeds: [
                  new EmbedBuilder()

                    .setTitle("Selfrole Creation")
                    .setColor(ee.color)
                    .setDescription(
                      "❌ | I cant put more than 1 deafult emoji!"
                    ),
                ],
                allowedMentions: { repliedUser: false },
              });
            }
            await emoji_msg.delete().catch((e) => true);
            emoji_ask_collector.map(
              async (msg) => await msg.delete().catch((e) => true)
            );
          }
          const btn_ask_style_embed = new EmbedBuilder()
            .setTitle("Selfrole Creation")
            .setColor(ee.color)
            .setDescription(
              "What should be the style of the button? This action is irreversible!"
            )
            .setImage("https://i.imgur.com/mUbn7PJ.png");
          const btn_ask_style_msg = await message.channel.send({
            embeds: [btn_ask_style_embed],

            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("Primary")
                  .setLabel("Button")
                  .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                  .setCustomId("Success")
                  .setLabel("Button")
                  .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                  .setCustomId("Secondary")
                  .setLabel("Button")
                  .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                  .setCustomId("Danger")
                  .setLabel("Button")
                  .setStyle(ButtonStyle.Danger)
              ),
            ],
          });
          let btn_ask_style_collector;
          try {
            btn_ask_style_collector =
              await btn_ask_style_msg.awaitMessageComponent({
                filter: (interaction) =>
                  interaction.user.id === message.author.id,
                time: 15_000,
                errors: ["time"],
              });
          } catch (e) {
            await btn_ask_style_msg.delete();
            return message.reply({
              embeds: [
                new EmbedBuilder()

                  .setDescription("❌ | You took too long to respond!")
                  .setColor(ee.wrongcolor),
              ],
            });
          }
          const btn_ask_style = btn_ask_style_collector.customId;
          await btn_ask_style_msg.delete();
          if (!btn_ask_style) {
            return message
              .reply({
                embeds: [
                  new EmbedBuilder()
                    .setTitle("Selfrole Creation")
                    .setColor(ee.wrongcolor)
                    .setDescription("❌ | You didn't provide a style!"),
                ],
                allowedMentions: { repliedUser: false },
              })
              .then((msg) =>
                setTimeout(() => msg.delete().catch((e) => true), 10000)
              );
          }

          const role_embed = new EmbedBuilder()
            .setTitle("Selfrole Creation")
            .setColor(ee.color)
            .setDescription(
              "Mention the role that will be given when the button is clicked"
            );
          const role_msg = await message.channel.send({ embeds: [role_embed] });
          let role_ask_collector;
          try {
            role_ask_collector = await role_msg.channel.awaitMessages({
              filter: (msg) => msg.author.id === message.author.id,
              max: 1,
              time: 15_000,
              errors: ["time"],
            });
          } catch (e) {
            return message.reply({
              embeds: [
                new EmbedBuilder()
                  .setDescription("❌ | You took too long to respond!")
                  .setColor(ee.wrongcolor),
              ],
            });
          }
          role_ask =
            role_ask_collector.first().mentions.roles.first() ||
            message.guild.roles.cache.get(role_ask_collector.first().content);
          if (!role_ask) {
            role_ask_collector.map(
              async (msg) => await msg.delete().catch((e) => true)
            );
            return message.reply({
              embeds: [
                new EmbedBuilder()

                  .setTitle("Selfrole Creation")
                  .setColor(ee.color)
                  .setDescription("❌ | You didn't mention a role!"),
              ],
              allowedMentions: { repliedUser: false },
            });
          }
          const role = role_ask.id;
          const role_name = role_ask.name;
          const role_position = role_ask.position;

          if (
            role_position >= message.guild.members.me.roles.highest.position
          ) {
            role_ask_collector.map(
              async (msg) => await msg.delete().catch((e) => true)
            );
            return message
              .reply({
                embeds: [
                  new EmbedBuilder()

                    .setTitle("Selfrole Creation")
                    .setColor(ee.color)
                    .setDescription(
                      "❌ | I cant give you a role higher than mine! \n\n Resting run the command again and choose a role below my highest role!"
                    ),
                ],
                allowedMentions: { repliedUser: false },
              })
              .then((msg) =>
                setTimeout(() => msg.delete().catch((e) => true), 10000)
              );
          }
          role_ask_collector.map(
            async (msg) => await msg.delete().catch((e) => true)
          );
          await role_msg.delete().catch((e) => true);
          const remarks_ask_embed = new EmbedBuilder()
            .setTitle("Selfrole Creation")
            .setColor(ee.color)
            .setDescription(
              "What should be the remarks of the button? This action is irreversible! \n\n **Example:** `ping-roles`, `color-roles` \n\n **Note:** This will later help you idenify the panel in the `!selfrole show` command or when you want to delete it or adding more roles to it!"
            );
          const remarks_ask_msg = await message.channel.send({
            embeds: [remarks_ask_embed],
          });
          let remarks_ask_collector;
          try {
            remarks_ask_collector = await remarks_ask_msg.channel.awaitMessages(
              {
                filter: (msg) => msg.author.id === message.author.id,
                max: 1,
                time: 15_000,
                errors: ["time"],
              }
            );
          } catch (e) {
            return message.reply({
              embeds: [
                new EmbedBuilder()
                  .setDescription("❌ | You took too long to respond!")
                  .setColor(ee.wrongcolor),
              ],
            });
          }
          remarks_ask = remarks_ask_collector.first().content;
          if (!remarks_ask) {
            remarks_ask_collector.map(
              async (msg) => await msg.delete().catch((e) => true)
            );
            return message.reply({
              embeds: [
                new EmbedBuilder()
                  .setDescription("❌ | You didn't provide a remarks!")
                  .setColor(ee.wrongcolor),
              ],
              allowedMentions: { repliedUser: false },
            });
          }
          remarks_ask_collector.map(
            async (msg) => await msg.delete().catch((e) => true)
          );
          await remarks_ask_msg.delete().catch((e) => true);
          const done_embed = new EmbedBuilder()

            .setTitle("Selfrole Creation")
            .setColor(ee.color)
            .setDescription(
              "Selfrole created successfully! Use them by using the `!selfrole show` command"
            );
          const done_msg = await message.channel.send({ embeds: [done_embed] });

          let data = await selfRolePanelSchema.findOne({
            guildId: message.guild.id,
          });
          if (!data) {
            data = new selfRolePanelSchema({
              remarks: remarks_ask,
              roleLimit: undefined,
              requiredRoles: [],
              embed: true,
              guildId: message.guild.id,
              panelId: 1,
              messageId: undefined,
              channelId: undefined,
              roles: [],
            });
          }
          data.roles.push({
            roleId: role,
            buttonId: `selfrole.${message.guild.id}.${generateCaptcha(4)}`,
            buttonStyle: btn_ask_style,
            buttonType: btn_ask,
            buttonLabel: label_ask || null,
            buttonEmoji: emoji_ask
              ? emoji_ask?.id
                ? emoji_ask.id
                : emoji_ask.name
              : null,
            buttonEmojiAnimated: emoji_ask?.animated || false,
            buttonEmojiDefault: emoji_ask
              ? emoji_ask.id
                ? false
                : true
              : false,
          });

          await data.save();
        });
        btn_ask_collector.on("end", async (collected, reason) => {
          if (reason === "time" || collected.size === 0) {
            await btn_ask_msg.delete().catch((e) => true);
            return message.reply({
              embeds: [
                new EmbedBuilder()
                  .setDescription("❌ | You took too long to respond!")
                  .setColor(ee.wrongcolor),
              ],
            });
          }
        });
      }
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};
