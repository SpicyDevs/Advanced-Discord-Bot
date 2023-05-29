const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits
} = require("discord.js");
const config = require("../../botconfig/config.js");
const ee = require("../../botconfig/embed.js");
const settings = require("../../botconfig/settings.js");
const axios = require("axios");

module.exports = {
  name: "embed", //the command name for the Slash Command
  slashName: "embed", //the command name for the Slash Command
  category: "Utility",
  aliases: [], //the command aliases [OPTIONAL]
  description: "Creates an embed with everything customizable.", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [PermissionFlagsBits.ManageMessages], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
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
    try {
      let tittle = "\u200b",
        description = "\u200b",
        color = ee.color,
        thumbnail = undefined,
        image = undefined,
        footer = "\u200b";
      const allComponents = [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("tittle")
            .setLabel("Tittle")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("description")
            .setLabel("Description")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("color")
            .setLabel("Color")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("thumbnail")
            .setLabel("Thumbnail")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("image")
            .setLabel("Image")
            .setStyle(ButtonStyle.Success)
        ),
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("footer")
            .setLabel("Footer")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("send")
            .setLabel("Send")
            .setStyle(ButtonStyle.Primary)
        ),
      ];
      const primaryColors = {
        Default: 0,
        Red: 15548997,
        Blue: 3447003,
        Green: 5763719,
        Yellow: 16705372,
      };
      const allColors = {
        Aqua: 1752220,
        Purple: 10181046,
        LuminousVividPink: 15277667,
        Fuchsia: 15418782,
        Gold: 15844367,
        Orange: 15105570,
        Grey: 9807270,
        Navy: 3426654,
        DarkAqua: 1146986,
        DarkGreen: 2067276,
        DarkBlue: 2123412,
        DarkPurple: 7419530,
        DarkVividPink: 11342935,
        DarkGold: 12745742,
        DarkOrange: 11027200,
        DarkRed: 10038562,
        DarkGrey: 9936031,
        DarkerGrey: 8359053,
        LightGrey: 12370112,
        DarkNavy: 2899536,
        Blurple: 5793266,
        Greyple: 10070709,
        DarkButNotBlack: 2895667,
        NotQuiteBlack: 2303786,
      };
      const msg = await interaction.reply({
        content: "This is an example embed, You can customize everything.",
        embeds: [
          new EmbedBuilder().setDescription(description).setColor(color),
        ],
        components: allComponents,
      });
      const collector_main = msg.createMessageComponentCollector({
        time: 150000,
      });
      collector_main.on("collect", async (i) => {
        if (i.user.id !== member.id) {
          return i.reply({
            content: "You are not allowed to use this button!",
            ephemeral: true,
          });
        }
        if (i.customId === "tittle") {
          await msg.edit({
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("tittle")
                  .setLabel("Tittle")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("description")
                  .setLabel("Description")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("color")
                  .setLabel("Color")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("thumbnail")
                  .setLabel("Thumbnail")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("image")
                  .setLabel("Image")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("footer")
                  .setLabel("Footer")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("send")
                  .setLabel("Send")
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(true)
              ),
            ],
          });
          const ask = await i.reply({
            content: "Please enter the tittle of the embed.",
          });
          const filter_tittle = (m) => m.author.id === i.user.id;
          const collector = interaction.channel.createMessageCollector({
            filter: filter_tittle,
            time: 150000,
          });
          collector.on("collect", async (m) => {
            console.log(m.content);
            if (m.content.length > 256) {
              await m.delete().catch((e) => true);
              return ask
                .reply({ content: "Tittle is too long!" })
                .then((msg_tittle) => {
                  setTimeout(() => {
                    msg_tittle.delete().catch((e) => true);
                  }, 5000);
                });
            }
            tittle = m.content;
            await ask.delete().catch((e) => true);
            await m.delete().catch((e) => true);
            msg.edit({
              content:
                "This is an example embed, You can customize everything.",
              embeds: [
                new EmbedBuilder()
                  .setTitle(tittle)
                  .setDescription(description)
                  .setColor(color)
                  .setThumbnail(thumbnail)
                  .setImage(image)
                  .setFooter({ text: footer }),
              ],
              components: allComponents,
            });
            collector.stop();
          });
          collector.on("end", async (collected) => {
            if (collected.size === 0) {
              ask.reply({ content: "Too late!" });
              await msg.delete().catch((e) => true);
            }
          });
        }
        if (i.customId === "description") {
          await msg.edit({
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("tittle")
                  .setLabel("Tittle")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("description")
                  .setLabel("Description")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("color")
                  .setLabel("Color")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("thumbnail")
                  .setLabel("Thumbnail")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("image")
                  .setLabel("Image")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("footer")
                  .setLabel("Footer")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("send")
                  .setLabel("Send")
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(true)
              ),
            ],
          });
          const ask = await i.reply({
            content: "Please enter the description of the embed.",
          });
          const filter_description = (m) => m.author.id === i.user.id;
          const collector = interaction.channel.createMessageCollector({
            filter: filter_description,
            time: 150000,
          });
          collector.on("collect", async (m) => {
            if (m.content.length > 2048) {
              await m.delete().catch((e) => true);
              return ask
                .reply({ content: "Description is too long!" })
                .then((msg_description) => {
                  setTimeout(() => {
                    msg_description.delete().catch((e) => true);
                  }, 5000);
                });
            }
            description = m.content;
            await ask.delete().catch((e) => true);
            await m.delete().catch((e) => true);
            msg.edit({
              content:
                "This is an example embed, You can customize everything.",
              embeds: [
                new EmbedBuilder()
                  .setTitle(tittle)
                  .setDescription(description)
                  .setColor(color)
                  .setThumbnail(thumbnail)
                  .setImage(image)
                  .setFooter({ text: footer }),
              ],
              components: allComponents,
            });
            collector.stop();
          });
          collector.on("end", async (collected) => {
            if (collected.size === 0) {
              ask.reply({ content: "Too late!" });
              await msg.delete().catch((e) => true);
            }
          });
        }
        if (i.customId === "color") {
          await msg.edit({
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("tittle")
                  .setLabel("Tittle")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("description")
                  .setLabel("Description")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("color")
                  .setLabel("Color")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("thumbnail")
                  .setLabel("Thumbnail")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("image")
                  .setLabel("Image")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("footer")
                  .setLabel("Footer")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("send")
                  .setLabel("Send")
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(true)
              ),
            ],
          });
          const ask = await i.reply({
            content: "Please choose the color of the embed.",
            embeds: [
              new EmbedBuilder()
                .setDescription("Choose a color from the list below.")
                .setColor(ee.color),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("default")
                  .setLabel("Default")
                  .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()

                  .setCustomId("red")
                  .setLabel("Red")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("blue")
                  .setLabel("Blue")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("green")
                  .setLabel("Green")
                  .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                  .setCustomId("hex")
                  .setLabel("Enter Hex?")
                  .setStyle(ButtonStyle.Secondary)
              ),
              new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                  .setCustomId("color_select")
                  .setPlaceholder("More Colors..")
                  .addOptions(
                    Object.entries(allColors).map(([color, value]) => {
                      return {
                        label: color,
                        value: color,
                      };
                    })
                  )
              ),
            ],
          });
          const collector_color = i.channel.createMessageComponentCollector({
            time: 150000,
          });
          collector_color.on("collect", async (color_input) => {
            if (color_input.user.id !== member.id) {
              return color_input.reply({
                content: "You are not allowed to use this button!",
                ephemeral: true,
              });
            }
            if (color_input.customId === "default") {
              color = primaryColors.Default;
              await ask.delete().catch((e) => true);
              msg.edit({
                content:
                  "This is an example embed, You can customize everything.",
                embeds: [
                  new EmbedBuilder()
                    .setTitle(tittle)
                    .setDescription(description)
                    .setColor(color)
                    .setThumbnail(thumbnail)
                    .setImage(image)
                    .setFooter({ text: footer }),
                ],
                components: allComponents,
              });
              collector_color.stop();
            }
            if (color_input.customId === "red") {
              color = primaryColors.Red;
              await ask.delete().catch((e) => true);
              msg.edit({
                content:
                  "This is an example embed, You can customize everything.",
                embeds: [
                  new EmbedBuilder()
                    .setTitle(tittle)
                    .setDescription(description)
                    .setColor(color)
                    .setThumbnail(thumbnail)
                    .setImage(image)
                    .setFooter({ text: footer }),
                ],
                components: allComponents,
              });
              collector_color.stop();
            }
            if (color_input.customId === "blue") {
              color = primaryColors.Blue;
              await ask.delete().catch((e) => true);
              msg.edit({
                content:
                  "This is an example embed, You can customize everything.",
                embeds: [
                  new EmbedBuilder()
                    .setTitle(tittle)
                    .setDescription(description)
                    .setColor(color)
                    .setThumbnail(thumbnail)
                    .setImage(image)
                    .setFooter({ text: footer }),
                ],
                components: allComponents,
              });
              collector_color.stop();
            }
            if (color_input.customId === "green") {
              color = primaryColors.Green;
              await ask.delete().catch((e) => true);
              msg.edit({
                content:
                  "This is an example embed, You can customize everything.",
                embeds: [
                  new EmbedBuilder()
                    .setTitle(tittle)
                    .setDescription(description)
                    .setColor(color)
                    .setThumbnail(thumbnail)
                    .setImage(image)
                    .setFooter({ text: footer }),
                ],
                components: allComponents,
              });
              collector_color.stop();
            }
            if (color_input.customId === "hex") {
              await ask.delete().catch((e) => true);
              const ask_2 = await color_input.reply({
                content: "Please enter the hex of the embed.",
              });
              const filter_hex = (m) => m.author.id === i.user.id;
              const collector = interaction.channel.createMessageCollector({
                filter: filter_hex,
                time: 150000,
              });
              collector.on("collect", async (m) => {
                await m.delete().catch((e) => true);
                try {
                  msg.edit({
                    content:
                      "This is an example embed, You can customize everything.",
                    embeds: [
                      new EmbedBuilder()
                        .setTitle(tittle)
                        .setDescription(description)
                        .setColor(m.content)
                        .setThumbnail(thumbnail)
                        .setImage(image)
                        .setFooter({ text: footer }),
                    ],
                    components: allComponents,
                  });
                } catch (e) {
                  return ask
                    .reply({ content: "Invalid Hex!" })
                    .then((hex_msg) => {
                      setTimeout(() => {
                        hex_msg.delete().catch((e) => true);
                      }, 5000);
                    });
                }
                color = m.content;
                await ask_2.delete().catch((e) => true);

                collector.stop();
              });
              collector.on("end", async (collected) => {
                if (collected.size === 0) {
                  ask.reply({ content: "Too late!" });
                  await msg.delete().catch((e) => true);
                }
              });
            }
            if (color_input.customId === "color_select") {
              color = allColors[color_input.values[0]];
              await ask.delete().catch((e) => true);
              msg.edit({
                content:
                  "This is an example embed, You can customize everything.",
                embeds: [
                  new EmbedBuilder()
                    .setTitle(tittle)
                    .setDescription(description)
                    .setColor(color)
                    .setThumbnail(thumbnail)
                    .setImage(image)
                    .setFooter({ text: footer }),
                ],
                components: allComponents,
              });
              collector_color.stop();
            }
          });
        }
        if (i.customId === "thumbnail") {
          await msg.edit({
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("tittle")
                  .setLabel("Tittle")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("description")
                  .setLabel("Description")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("color")
                  .setLabel("Color")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("thumbnail")
                  .setLabel("Thumbnail")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("image")
                  .setLabel("Image")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("footer")
                  .setLabel("Footer")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("send")
                  .setLabel("Send")
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(true)
              ),
            ],
          });
          const ask = await i.reply({
            content: "Please enter the thumbnail of the embed.",
          });
          const filter_thumbnail = (m) => m.author.id === i.user.id;
          const collector = interaction.channel.createMessageCollector({
            filter: filter_thumbnail,
            time: 150000,
          });
          collector.on("collect", async (m) => {
            const check = await validateImage(m.content);
            if (!check) {
              await m.delete().catch((e) => true);
              return ask
                .reply({ content: "Invalid Image!" })
                .then((msg_image) => {
                  setTimeout(() => {
                    msg_image.delete().catch((e) => true);
                  }, 5000);
                });
            }
            thumbnail = m.content;
            await ask.delete().catch((e) => true);
            await m.delete().catch((e) => true);
            msg.edit({
              content:
                "This is an example embed, You can customize everything.",
              embeds: [
                new EmbedBuilder()
                  .setTitle(tittle)
                  .setDescription(description)
                  .setColor(color)
                  .setThumbnail(thumbnail)
                  .setImage(image)
                  .setFooter({ text: footer }),
              ],
              components: allComponents,
            });
            collector.stop();
          });
          collector.on("end", async (collected) => {
            if (collected.size === 0) {
              ask.reply({ content: "Too late!" });
              await msg.delete().catch((e) => true);
            }
          });
        }
        if (i.customId === "image") {
          await msg.edit({
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("tittle")
                  .setLabel("Tittle")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("description")
                  .setLabel("Description")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("color")
                  .setLabel("Color")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("thumbnail")
                  .setLabel("Thumbnail")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("image")
                  .setLabel("Image")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("footer")
                  .setLabel("Footer")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("send")
                  .setLabel("Send")
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(true)
              ),
            ],
          });
          const ask = await i.reply({
            content: "Please enter the image of the embed.",
          });
          const filter_image = (m) => m.author.id === i.user.id;
          const collector = interaction.channel.createMessageCollector({
            filter: filter_image,
            time: 150000,
          });
          collector.on("collect", async (m) => {
            const check = await validateImage(m.content);
            if (!check) {
              await m.delete().catch((e) => true);
              return ask
                .reply({ content: "Invalid Image!" })
                .then((msg_image) => {
                  setTimeout(() => {
                    msg_image.delete().catch((e) => true);
                  }, 5000);
                });
            }
            image = m.content;
            await ask.delete().catch((e) => true);
            await m.delete().catch((e) => true);
            msg.edit({
              content:
                "This is an example embed, You can customize everything.",
              embeds: [
                new EmbedBuilder()
                  .setTitle(tittle)
                  .setDescription(description)
                  .setColor(color)
                  .setThumbnail(thumbnail)
                  .setImage(image)
                  .setFooter({ text: footer }),
              ],
              components: allComponents,
            });
            collector.stop();
          });
          collector.on("end", async (collected) => {
            if (collected.size === 0) {
              ask.reply({ content: "Too late!" });
            }
          });
        }
        if (i.customId === "footer") {
          await msg.edit({
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("tittle")
                  .setLabel("Tittle")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("description")
                  .setLabel("Description")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("color")
                  .setLabel("Color")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("thumbnail")
                  .setLabel("Thumbnail")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("image")
                  .setLabel("Image")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("footer")
                  .setLabel("Footer")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("send")
                  .setLabel("Send")
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(true)
              ),
            ],
          });
          const ask = await i.reply({
            content: "Please enter the footer of the embed.",
          });
          const filter_footer = (m) => m.author.id === i.user.id;
          const collector = interaction.channel.createMessageCollector({
            filter: filter_footer,
            time: 150000,
          });
          collector.on("collect", async (m) => {
            if (m.content.length > 2048) {
              await m.delete().catch((e) => true);
              return ask
                .reply({ content: "Footer is too long!" })
                .then((msg_footer) => {
                  setTimeout(() => {
                    msg_footer.delete().catch((e) => true);
                  }, 5000);
                });
            }
            footer = m.content;
            await ask.delete().catch((e) => true);
            await m.delete().catch((e) => true);
            msg.edit({
              content:
                "This is an example embed, You can customize everything.",
              embeds: [
                new EmbedBuilder()
                  .setTitle(tittle)
                  .setDescription(description)
                  .setColor(color)
                  .setThumbnail(thumbnail)
                  .setImage(image)
                  .setFooter({ text: footer }),
              ],
              components: allComponents,
            });
            collector.stop();
          });
          collector.on("end", async (collected) => {
            if (collected.size === 0) {
              ask.reply({ content: "Too late!" });
              await msg.delete().catch((e) => true);
            }
          });
        }
        if (i.customId === "send") {
          const ask = await i.reply({
            content: "Mention the channel you want to send the embed in.",
          });
          const filter_send = (m) => m.author.id === i.user.id;
          await msg.edit({
            content: "This is an example embed, You can customize everything.",
            embeds: [
              new EmbedBuilder()
                .setTitle(tittle)
                .setDescription(description)
                .setColor(color)
                .setThumbnail(thumbnail)
                .setImage(image)
                .setFooter({ text: footer }),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("tittle")
                  .setLabel("Tittle")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("description")
                  .setLabel("Description")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("color")
                  .setLabel("Color")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("thumbnail")
                  .setLabel("Thumbnail")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("image")
                  .setLabel("Image")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("footer")
                  .setLabel("Footer")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("send")
                  .setLabel("Send")
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(true)
              ),
            ],
          });
          const collector = interaction.channel.createMessageCollector({
            filter: filter_send,
            time: 150000,
          });
          collector.on("collect", async (m) => {
            const channel =
              m.mentions.channels.first() ||
              interaction.guild.channels.cache.get(m.content);
            if (!channel)
              return ask.reply({ content: "Please mention a valid channel." });
            channel.send({
              embeds: [
                new EmbedBuilder()
                  .setTitle(tittle)
                  .setDescription(description)
                  .setColor(color)
                  .setThumbnail(thumbnail)
                  .setImage(image)
                  .setFooter({ text: footer }),
              ],
            });
            interaction.channel.send({
              content: `Embed sent in ${channel}`,
            });
            await msg.delete().catch((e) => true);
            collector.stop();
          });

          collector_main.stop();
        }
      });
      collector_main.on("end", async (collected) => {
        if (collected.size === 0) {
          ask.reply({ content: "Too late!" });
          await msg.delete().catch((e) => true);
        }
        await msg.delete().catch((e) => true);
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
      let tittle = "\u200b",
        description = "\u200b",
        color = ee.color,
        thumbnail = undefined,
        image = undefined,
        footer = "\u200b";
      const allComponents = [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("tittle")
            .setLabel("Tittle")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("description")
            .setLabel("Description")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("color")
            .setLabel("Color")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("thumbnail")
            .setLabel("Thumbnail")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("image")
            .setLabel("Image")
            .setStyle(ButtonStyle.Success)
        ),
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("footer")
            .setLabel("Footer")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("send")
            .setLabel("Send")
            .setStyle(ButtonStyle.Primary)
        ),
      ];
      const primaryColors = {
        Default: 0,
        Red: 15548997,
        Blue: 3447003,
        Green: 5763719,
        Yellow: 16705372,
      };
      const allColors = {
        Aqua: 1752220,
        Purple: 10181046,
        LuminousVividPink: 15277667,
        Fuchsia: 15418782,
        Gold: 15844367,
        Orange: 15105570,
        Grey: 9807270,
        Navy: 3426654,
        DarkAqua: 1146986,
        DarkGreen: 2067276,
        DarkBlue: 2123412,
        DarkPurple: 7419530,
        DarkVividPink: 11342935,
        DarkGold: 12745742,
        DarkOrange: 11027200,
        DarkRed: 10038562,
        DarkGrey: 9936031,
        DarkerGrey: 8359053,
        LightGrey: 12370112,
        DarkNavy: 2899536,
        Blurple: 5793266,
        Greyple: 10070709,
        DarkButNotBlack: 2895667,
        NotQuiteBlack: 2303786,
      };
      const msg = await message.reply({
        content: "This is an example embed, You can customize everything.",
        embeds: [
          new EmbedBuilder().setDescription(description).setColor(color),
        ],
        components: allComponents,
      });
      const collector_main = msg.createMessageComponentCollector({
        time: 150000,
      });
      collector_main.on("collect", async (i) => {
        if (i.user.id !== message.author.id) {
          return i.reply({
            content: "You are not allowed to use this button!",
            ephemeral: true,
          });
        }
        if (i.customId === "tittle") {
          await msg.edit({
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("tittle")
                  .setLabel("Tittle")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("description")
                  .setLabel("Description")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("color")
                  .setLabel("Color")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("thumbnail")
                  .setLabel("Thumbnail")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("image")
                  .setLabel("Image")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("footer")
                  .setLabel("Footer")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("send")
                  .setLabel("Send")
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(true)
              ),
            ],
          });
          const ask = await i.reply({
            content: "Please enter the tittle of the embed.",
          });
          const filter_tittle = (m) => m.author.id === i.user.id;
          const collector = message.channel.createMessageCollector({
            filter: filter_tittle,
            time: 150000,
          });
          collector.on("collect", async (m) => {
            console.log(m.content);
            if (m.content.length > 256) {
              await m.delete().catch((e) => true);
              return message
                .reply({ content: "Tittle is too long!" })
                .then((msg_tittle) => {
                  setTimeout(() => {
                    msg_tittle.delete().catch((e) => true);
                  }, 5000);
                });
            }
            tittle = m.content;
            await ask.delete().catch((e) => true);
            await m.delete().catch((e) => true);
            msg.edit({
              content:
                "This is an example embed, You can customize everything.",
              embeds: [
                new EmbedBuilder()
                  .setTitle(tittle)
                  .setDescription(description)
                  .setColor(color)
                  .setThumbnail(thumbnail)
                  .setImage(image)
                  .setFooter({ text: footer }),
              ],
              components: allComponents,
            });
            collector.stop();
          });
          collector.on("end", async (collected) => {
            if (collected.size === 0) {
              message.reply({ content: "Too late!" });
              await ask.delete().catch((e) => true);
              await msg.delete().catch((e) => true);
            }
          });
        }
        if (i.customId === "description") {
          await msg.edit({
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("tittle")
                  .setLabel("Tittle")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("description")
                  .setLabel("Description")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("color")
                  .setLabel("Color")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("thumbnail")
                  .setLabel("Thumbnail")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("image")
                  .setLabel("Image")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("footer")
                  .setLabel("Footer")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("send")
                  .setLabel("Send")
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(true)
              ),
            ],
          });
          const ask = await i.reply({
            content: "Please enter the description of the embed.",
          });
          const filter_description = (m) => m.author.id === i.user.id;
          const collector = message.channel.createMessageCollector({
            filter: filter_description,
            time: 150000,
          });
          collector.on("collect", async (m) => {
            if (m.content.length > 2048) {
              await m.delete().catch((e) => true);
              return message
                .reply({ content: "Description is too long!" })
                .then((msg_description) => {
                  setTimeout(() => {
                    msg_description.delete().catch((e) => true);
                  }, 5000);
                });
            }
            description = m.content;
            await ask.delete().catch((e) => true);
            await m.delete().catch((e) => true);
            msg.edit({
              content:
                "This is an example embed, You can customize everything.",
              embeds: [
                new EmbedBuilder()
                  .setTitle(tittle)
                  .setDescription(description)
                  .setColor(color)
                  .setThumbnail(thumbnail)
                  .setImage(image)
                  .setFooter({ text: footer }),
              ],
              components: allComponents,
            });
            collector.stop();
          });
          collector.on("end", async (collected) => {
            if (collected.size === 0) {
              message.reply({ content: "Too late!" });
              await ask.delete().catch((e) => true);
              await msg.delete().catch((e) => true);
            }
          });
        }
        if (i.customId === "color") {
          await msg.edit({
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("tittle")
                  .setLabel("Tittle")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("description")
                  .setLabel("Description")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("color")
                  .setLabel("Color")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("thumbnail")
                  .setLabel("Thumbnail")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("image")
                  .setLabel("Image")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("footer")
                  .setLabel("Footer")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("send")
                  .setLabel("Send")
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(true)
              ),
            ],
          });
          const ask = await i.reply({
            content: "Please choose the color of the embed.",
            embeds: [
              new EmbedBuilder()
                .setDescription("Choose a color from the list below.")
                .setColor(ee.color),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("default")
                  .setLabel("Default")
                  .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()

                  .setCustomId("red")
                  .setLabel("Red")
                  .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                  .setCustomId("blue")
                  .setLabel("Blue")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("green")
                  .setLabel("Green")
                  .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                  .setCustomId("hex")
                  .setLabel("Enter Hex?")
                  .setStyle(ButtonStyle.Secondary)
              ),
              new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                  .setCustomId("color_select")
                  .setPlaceholder("More Colors..")
                  .addOptions(
                    Object.entries(allColors).map(([color, value]) => {
                      return {
                        label: color,
                        value: color,
                      };
                    })
                  )
              ),
            ],
          });
          const collector_color = i.channel.createMessageComponentCollector({
            time: 150000,
          });
          collector_color.on("collect", async (color_input) => {
            if (color_input.user.id !== message.author.id) {
              return color_input.reply({
                content: "You are not allowed to use this button!",
                ephemeral: true,
              });
            }
            if (color_input.customId === "default") {
              color = primaryColors.Default;
              await ask.delete().catch((e) => true);
              msg.edit({
                content:
                  "This is an example embed, You can customize everything.",
                embeds: [
                  new EmbedBuilder()
                    .setTitle(tittle)
                    .setDescription(description)
                    .setColor(color)
                    .setThumbnail(thumbnail)
                    .setImage(image)
                    .setFooter({ text: footer }),
                ],
                components: allComponents,
              });
              collector_color.stop();
            }
            if (color_input.customId === "red") {
              color = primaryColors.Red;
              await ask.delete().catch((e) => true);
              msg.edit({
                content:
                  "This is an example embed, You can customize everything.",
                embeds: [
                  new EmbedBuilder()
                    .setTitle(tittle)
                    .setDescription(description)
                    .setColor(color)
                    .setThumbnail(thumbnail)
                    .setImage(image)
                    .setFooter({ text: footer }),
                ],
                components: allComponents,
              });
              collector_color.stop();
            }
            if (color_input.customId === "blue") {
              color = primaryColors.Blue;
              await ask.delete().catch((e) => true);
              msg.edit({
                content:
                  "This is an example embed, You can customize everything.",
                embeds: [
                  new EmbedBuilder()
                    .setTitle(tittle)
                    .setDescription(description)
                    .setColor(color)
                    .setThumbnail(thumbnail)
                    .setImage(image)
                    .setFooter({ text: footer }),
                ],
                components: allComponents,
              });
              collector_color.stop();
            }
            if (color_input.customId === "green") {
              color = primaryColors.Green;
              await ask.delete().catch((e) => true);
              msg.edit({
                content:
                  "This is an example embed, You can customize everything.",
                embeds: [
                  new EmbedBuilder()
                    .setTitle(tittle)
                    .setDescription(description)
                    .setColor(color)
                    .setThumbnail(thumbnail)
                    .setImage(image)
                    .setFooter({ text: footer }),
                ],
                components: allComponents,
              });
              collector_color.stop();
            }
            if (color_input.customId === "hex") {
              await ask.delete().catch((e) => true);
              const ask_2 = await color_input.reply({
                content: "Please enter the hex of the embed.",
              });
              const filter_hex = (m) => m.author.id === i.user.id;
              const collector = message.channel.createMessageCollector({
                filter: filter_hex,
                time: 150000,
              });
              collector.on("collect", async (m) => {
                await m.delete().catch((e) => true);
                try {
                  msg.edit({
                    content:
                      "This is an example embed, You can customize everything.",
                    embeds: [
                      new EmbedBuilder()
                        .setTitle(tittle)
                        .setDescription(description)
                        .setColor(m.content)
                        .setThumbnail(thumbnail)
                        .setImage(image)
                        .setFooter({ text: footer }),
                    ],
                    components: allComponents,
                  });
                } catch (e) {
                  return message
                    .reply({ content: "Invalid Hex!" })
                    .then((hex_msg) => {
                      setTimeout(() => {
                        hex_msg.delete().catch((e) => true);
                      }, 5000);
                    });
                }
                color = m.content;
                await ask_2.delete().catch((e) => true);

                collector.stop();
              });
              collector.on("end", async (collected) => {
                if (collected.size === 0) {
                  message.reply({ content: "Too late!" });
                  await ask.delete().catch((e) => true);
                  await msg.delete().catch((e) => true);
                }
              });
            }
            if (color_input.customId === "color_select") {
              color = allColors[color_input.values[0]];
              await ask.delete().catch((e) => true);
              msg.edit({
                content:
                  "This is an example embed, You can customize everything.",
                embeds: [
                  new EmbedBuilder()
                    .setTitle(tittle)
                    .setDescription(description)
                    .setColor(color)
                    .setThumbnail(thumbnail)
                    .setImage(image)
                    .setFooter({ text: footer }),
                ],
                components: allComponents,
              });
              collector_color.stop();
            }
          });
        }
        if (i.customId === "thumbnail") {
          await msg.edit({
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("tittle")
                  .setLabel("Tittle")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("description")
                  .setLabel("Description")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("color")
                  .setLabel("Color")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("thumbnail")
                  .setLabel("Thumbnail")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("image")
                  .setLabel("Image")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("footer")
                  .setLabel("Footer")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("send")
                  .setLabel("Send")
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(true)
              ),
            ],
          });
          const ask = await i.reply({
            content: "Please enter the thumbnail of the embed.",
          });
          const filter_thumbnail = (m) => m.author.id === i.user.id;
          const collector = message.channel.createMessageCollector({
            filter: filter_thumbnail,
            time: 150000,
          });
          collector.on("collect", async (m) => {
            const check = await validateImage(m.content);
            if (!check) {
              await m.delete().catch((e) => true);
              return message
                .reply({ content: "Invalid Image!" })
                .then((msg_image) => {
                  setTimeout(() => {
                    msg_image.delete().catch((e) => true);
                  }, 5000);
                });
            }
            thumbnail = m.content;
            await ask.delete().catch((e) => true);
            await m.delete().catch((e) => true);
            msg.edit({
              content:
                "This is an example embed, You can customize everything.",
              embeds: [
                new EmbedBuilder()
                  .setTitle(tittle)
                  .setDescription(description)
                  .setColor(color)
                  .setThumbnail(thumbnail)
                  .setImage(image)
                  .setFooter({ text: footer }),
              ],
              components: allComponents,
            });
            collector.stop();
          });
          collector.on("end", async (collected) => {
            if (collected.size === 0) {
              message.reply({ content: "Too late!" });
              await ask.delete().catch((e) => true);
              await msg.delete().catch((e) => true);
            }
          });
        }
        if (i.customId === "image") {
          await msg.edit({
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("tittle")
                  .setLabel("Tittle")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("description")
                  .setLabel("Description")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("color")
                  .setLabel("Color")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("thumbnail")
                  .setLabel("Thumbnail")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("image")
                  .setLabel("Image")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("footer")
                  .setLabel("Footer")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("send")
                  .setLabel("Send")
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(true)
              ),
            ],
          });
          const ask = await i.reply({
            content: "Please enter the image of the embed.",
          });
          const filter_image = (m) => m.author.id === i.user.id;
          const collector = message.channel.createMessageCollector({
            filter: filter_image,
            time: 150000,
          });
          collector.on("collect", async (m) => {
            const check = await validateImage(m.content);
            if (!check) {
              await m.delete().catch((e) => true);
              return message
                .reply({ content: "Invalid Image!" })
                .then((msg_image) => {
                  setTimeout(() => {
                    msg_image.delete().catch((e) => true);
                  }, 5000);
                });
            }
            image = m.content;
            await ask.delete().catch((e) => true);
            await m.delete().catch((e) => true);
            msg.edit({
              content:
                "This is an example embed, You can customize everything.",
              embeds: [
                new EmbedBuilder()
                  .setTitle(tittle)
                  .setDescription(description)
                  .setColor(color)
                  .setThumbnail(thumbnail)
                  .setImage(image)
                  .setFooter({ text: footer }),
              ],
              components: allComponents,
            });
            collector.stop();
          });
          collector.on("end", async (collected) => {
            if (collected.size === 0) {
              message.reply({ content: "Too late!" });
              await ask.delete().catch((e) => true);
              await ask.delete().catch((e) => true);
            }
          });
        }
        if (i.customId === "footer") {
          await msg.edit({
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("tittle")
                  .setLabel("Tittle")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("description")
                  .setLabel("Description")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("color")
                  .setLabel("Color")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("thumbnail")
                  .setLabel("Thumbnail")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("image")
                  .setLabel("Image")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("footer")
                  .setLabel("Footer")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("send")
                  .setLabel("Send")
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(true)
              ),
            ],
          });
          const ask = await i.reply({
            content: "Please enter the footer of the embed.",
          });
          const filter_footer = (m) => m.author.id === i.user.id;
          const collector = message.channel.createMessageCollector({
            filter: filter_footer,
            time: 150000,
          });
          collector.on("collect", async (m) => {
            if (m.content.length > 2048) {
              await m.delete().catch((e) => true);
              return message
                .reply({ content: "Footer is too long!" })
                .then((msg_footer) => {
                  setTimeout(() => {
                    msg_footer.delete().catch((e) => true);
                  }, 5000);
                });
            }
            footer = m.content;
            await ask.delete().catch((e) => true);
            await m.delete().catch((e) => true);
            msg.edit({
              content:
                "This is an example embed, You can customize everything.",
              embeds: [
                new EmbedBuilder()
                  .setTitle(tittle)
                  .setDescription(description)
                  .setColor(color)
                  .setThumbnail(thumbnail)
                  .setImage(image)
                  .setFooter({ text: footer }),
              ],
              components: allComponents,
            });
            collector.stop();
          });
          collector.on("end", async (collected) => {
            if (collected.size === 0) {
              message.reply({ content: "Too late!" });
              await ask.delete().catch((e) => true);
              await msg.delete().catch((e) => true);
            }
          });
        }
        if (i.customId === "send") {
          const ask = await i.reply({
            content: "Mention the channel you want to send the embed in.",
          });
          const filter_send = (m) => m.author.id === i.user.id;
          await msg.edit({
            content: "This is an example embed, You can customize everything.",
            embeds: [
              new EmbedBuilder()
                .setTitle(tittle)
                .setDescription(description)
                .setColor(color)
                .setThumbnail(thumbnail)
                .setImage(image)
                .setFooter({ text: footer }),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("tittle")
                  .setLabel("Tittle")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("description")
                  .setLabel("Description")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("color")
                  .setLabel("Color")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("thumbnail")
                  .setLabel("Thumbnail")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("image")
                  .setLabel("Image")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("footer")
                  .setLabel("Footer")
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("send")
                  .setLabel("Send")
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(true)
              ),
            ],
          });
          const collector = message.channel.createMessageCollector({
            filter: filter_send,
            time: 150000,
          });
          collector.on("collect", async (m) => {
            const channel =
              m.mentions.channels.first() ||
              message.guild.channels.cache.get(m.content);
            if (!channel)
              return message.reply({ content: "Please mention a channel." });
            channel.send({
              embeds: [
                new EmbedBuilder()
                  .setTitle(tittle)
                  .setDescription(description)
                  .setColor(color)
                  .setThumbnail(thumbnail)
                  .setImage(image)
                  .setFooter({ text: footer }),
              ],
            });
            message.channel.send({
              content: `Embed sent in ${channel}`,
            });
            await msg.delete().catch((e) => true);
            collector.stop();
          });

          collector_main.stop();
        }
      });
      collector_main.on("end", async (collected) => {
        if (collected.size === 0) {
          message.reply({ content: "Too late!" });
          await ask.delete().catch((e) => true);
          await msg.delete().catch((e) => true);
        }
        await msg.delete().catch((e) => true);
      });
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

function isHexadecimal(s) {
  s = s.replace(/^#/, "");
  return /^[0-9A-Fa-f]+$/.test(s);
}

async function validateImage(url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const contentType = response.headers["content-type"];

    if (
      contentType === "image/png" ||
      contentType === "image/jpeg" ||
      contentType === "image/webp"
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}
