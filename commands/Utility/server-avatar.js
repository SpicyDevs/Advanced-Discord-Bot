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
const { GetGlobalUser } = require("../../handlers/functions.js");
module.exports = {
  name: "server avatar", //the command name for the Slash Command
  slashName: "server-avatar", //the command name for the Slash Command
  category: "Utility",
  aliases: ["sa"], //the command aliases [OPTIONAL]
  description: "Shows banner of the server and it's logo", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  allowedserverIDs: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [
    //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
    //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ]
    //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
    {
      String: {
        name: "server_id",
        description: "ID of the server you want to get avatar of?",
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
      let serverID = options.getString("server_id")
        ? options.getString("server_id")
        : guild.id;
      const sizeLanguage = "Size";
      const serverAvatarLanguage = "Server Avatar";
      const displayAvatarLanguage = "Displayed Avatar Of";
      const displayBannerLanguage = "Displayed Banner";
      const animatedLanguage = "Animated";
      const formatLanguage = "Format";
      const fieldTitleLanguage = "Information:";

      const guildExists = await interaction.client.guilds
        .fetch(serverID)
        .then(() => true)
        .catch(() => false);
      const guildFinal = await interaction.client.guilds.fetch(
        guildExists ? serverID : guild.id
      );

      let type = "avatar";
      let sizes = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
      let formats = [
        "jpg",
        "png",
        "webp",
        ...(guildFinal.iconURL().includes(".gif") ? ["gif"] : []),
      ];
      let change = "user";

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${guildFinal.name} Logo`,
          iconURL: guildFinal.iconURL({ size: 1024 }),
        })
        .setFooter({
          text: `${guildFinal.name} Logo`,
          iconURL: guildFinal.iconURL(),
        });
      embed.addFields({
        name: `${fieldTitleLanguage}`,
        value: [
          `${animatedLanguage}: ${
            guildFinal.iconURL().includes(".gif") ? "Yes" : "No"
          }`,
          `${serverAvatarLanguage}: No`,
        ]
          .filter(function (e) {
            return e;
          })
          .join("\n"),
      });
      embed.setColor(ee.color).setImage(guildFinal.iconURL({ size: 1024 }));
      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("change-to-banner")
          .setLabel("Banner")
          .setStyle("Primary")
          .setDisabled(!guildFinal.banner),
        new ButtonBuilder()
          .setURL(guildFinal.iconURL({ size: 1024 }))
          .setLabel("Avatar Link")
          .setStyle("Link")
      );
      const size_menu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .addOptions(
            sizes.map((size) => ({
              label: `${size}x${size}`,
              value: size.toString(),
            }))
          )
          .setCustomId("size_menu")
          .setPlaceholder(`${sizeLanguage}: 1024x1024`)
          .setMaxValues(1)
          .setDisabled(!guildFinal.icon)
      );
      const format_menu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .addOptions(
            formats.map((format) => ({
              label: format.toUpperCase(),
              value: format,
            }))
          )
          .setCustomId("format_menu")
          .setPlaceholder(
            `${formatLanguage}: ${
              guildFinal.iconURL().includes(".gif") ? "GIF" : "WEBP"
            }`
          )
          .setMaxValues(1)
          .setDisabled(!guildFinal.icon)
      );
      const e = await interaction.reply({
        embeds: [embed],
        components: [size_menu, format_menu, button],
      });
      e.createMessageComponentCollector({ idle: 3e5 })
        .on("collect", async (i) => {
          await i.deferUpdate();
          var size = 1024;
          var format = guildFinal.icon.includes("a_")
            ? "gif"
            : embed.data.image.url.split(".").pop().split("?")[0] || "webp";
          if (i.user.id === member.id) {
            if (type === "avatar") {
              size = embed.data.image.url.split("?size=")[1] || 1024;
              format =
                embed.data.image.url.split(".").pop().split("?")[0] || "webp";
              if (i.customId === "change-to-banner") {
                format = guildFinal.banner.includes("a_") ? "gif" : "webp";
                type = "banner";
                change = "user";
                let formats1 = [
                  "jpg",
                  "png",
                  "webp",
                  ...(guildFinal.bannerURL().includes(".gif") ? ["gif"] : []),
                ];
                await button.components[0]
                  .setCustomId("change-to-avatar")
                  .setLabel("Avatar");
                await format_menu.components[0]
                  .setOptions(
                    formats1.map((format) => ({
                      label: format.toUpperCase(),
                      value: format,
                    }))
                  )
                  .setPlaceholder(`${formatLanguage}: ${format.toUpperCase()}`);
                await button.components[1]
                  .setURL(
                    guildFinal.bannerURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  )
                  .setLabel("Banner Link");
                embed.setFields({
                  name: `${fieldTitleLanguage}`,
                  value: [
                    `${animatedLanguage}: ${
                      guildFinal.bannerURL().includes(".gif") ? "Yes" : "No"
                    }`,
                  ]
                    .filter(function (e) {
                      return e;
                    })
                    .join("\n"),
                });
                embed.setImage(
                  guildFinal.bannerURL({
                    forceStatic: true,
                    extension: format,
                    size: Number(size),
                  })
                );
                await i.editReply({
                  embeds: [embed],
                  components: [size_menu, format_menu, button],
                });
              } else if (i.customId === "size_menu") {
                size = i.values[0];
                if (change === "user") {
                  embed.setImage(
                    guildFinal.iconURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    guildFinal.iconURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await size_menu.components[0].setPlaceholder(
                    `${sizeLanguage}: ${size}x${size}`
                  );
                  await i.editReply({
                    embeds: [embed],
                    components: [size_menu, format_menu, button],
                  });
                } else if (change === "server") {
                  embed.setImage(
                    member.iconURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    member.iconURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await size_menu.components[0].setPlaceholder(
                    `${sizeLanguage}: ${size}x${size}`
                  );
                  await i.editReply({
                    embeds: [embed],
                    components: [size_menu, format_menu, button],
                  });
                }
              } else if (i.customId === "format_menu") {
                var format = i.values[0];
                size = embed.data.image.url.split("?size=")[1];
                if (change === "user") {
                  embed.setImage(
                    guildFinal.iconURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    guildFinal.iconURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await format_menu.components[0].setPlaceholder(
                    `${formatLanguage}: ${format.toUpperCase()}`
                  );
                  await i.editReply({
                    embeds: [embed],
                    components: [size_menu, format_menu, button],
                  });
                } else if (change === "server") {
                  embed.setImage(
                    member.iconURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    member.iconURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await format_menu.components[0].setPlaceholder(
                    `${formatLanguage}: ${format.toUpperCase()}`
                  );
                  await i.editReply({
                    embeds: [embed],
                    components: [size_menu, format_menu, button],
                  });
                }
              }
            } else if (type === "banner") {
              size = embed.data.image.url.split("?size=")[1] || 1024;
              format =
                embed.data.image.url.split(".").pop().split("?")[0] || "webp";
              if (i.customId === "change-to-avatar") {
                format = guildFinal.icon.includes("a_") ? "gif" : "webp";
                type = "avatar";
                change = "user";
                let formats3 = [
                  "jpg",
                  "png",
                  "webp",
                  ...(guildFinal.iconURL().includes(".gif") ? ["gif"] : []),
                ];
                await button.components[0]
                  .setCustomId("change-to-banner")
                  .setLabel("Banner");
                await format_menu.components[0]
                  .setOptions(
                    formats3.map((format) => ({
                      label: format.toUpperCase(),
                      value: format,
                    }))
                  )
                  .setPlaceholder(`${formatLanguage}: ${format.toUpperCase()}`);
                await button.components[1]
                  .setURL(
                    guildFinal.iconURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  )
                  .setLabel("Avatar Link");
                embed.setFields({
                  name: `${fieldTitleLanguage}`,
                  value: [
                    `${animatedLanguage}: ${
                      String(guildFinal.iconURL()).includes(".gif")
                        ? "Yes"
                        : "No"
                    }`,
                    `${serverAvatarLanguage}: ${"No"}`,
                  ]
                    .filter(function (e) {
                      return e;
                    })
                    .join("\n"),
                });
                embed.setImage(
                  guildFinal.iconURL({
                    forceStatic: true,
                    extension: format,
                    size: Number(size),
                  })
                );
                await i.editReply({
                  embeds: [embed],
                  components: [size_menu, format_menu, button],
                });
              }
              if (i.customId === "size_menu") {
                size = i.values[0];
                if (change === "user") {
                  embed.setImage(
                    guildFinal.bannerURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    guildFinal.bannerURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await size_menu.components[0].setPlaceholder(
                    `${sizeLanguage}: ${size}x${size}`
                  );
                  await i.editReply({
                    embeds: [embed],
                    components: [size_menu, format_menu, button],
                  });
                }
              } else if (i.customId === "format_menu") {
                var format = i.values[0];
                size = embed.data.image.url.split("?size=")[1];
                if (change === "user") {
                  embed.setImage(
                    guildFinal.bannerURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    guildFinal.bannerURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await format_menu.components[0].setPlaceholder(
                    `${formatLanguage}: ${format.toUpperCase()}`
                  );
                  await i.editReply({
                    embeds: [embed],
                    components: [size_menu, format_menu, button],
                  });
                }
              }
            }
          } else {
            return await i.followUp({
              content: `You Can't Interact With This Command As It Used By Other User`,
              ephemeral: true,
            });
          }
        })
        .on("end", async () => {
          size_menu.components[0].setDisabled(true);
          format_menu.components[0].setDisabled(true);
          button.components[0].setDisabled(true);

          e.edit({ components: [size_menu, format_menu, button] });
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
      let serverID = args[0] ? args[0] : message.guild.id;
      const sizeLanguage = "Size";
      const serverAvatarLanguage = "Server Avatar";
      const displayAvatarLanguage = "Displayed Avatar Of";
      const displayBannerLanguage = "Displayed Banner";
      const animatedLanguage = "Animated";
      const formatLanguage = "Format";
      const fieldTitleLanguage = "Information:";

      const guildExists = await message.client.guilds
        .fetch(serverID)
        .then(() => true)
        .catch(() => false);
      const guildFinal = await message.client.guilds.fetch(
        guildExists ? serverID : message.guild.id
      );

      let type = "avatar";
      let sizes = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
      let formats = [
        "jpg",
        "png",
        "webp",
        ...(guildFinal.iconURL().includes(".gif") ? ["gif"] : []),
      ];
      let change = "user";

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${guildFinal.name} Logo`,
          iconURL: guildFinal.iconURL({ size: 1024 }),
        })
        .setFooter({
          text: `${guildFinal.name} Logo`,
          iconURL: guildFinal.iconURL(),
        });
      embed.addFields({
        name: `${fieldTitleLanguage}`,
        value: [
          `${animatedLanguage}: ${
            guildFinal.iconURL().includes(".gif") ? "Yes" : "No"
          }`,
          `${serverAvatarLanguage}: No`,
        ]
          .filter(function (e) {
            return e;
          })
          .join("\n"),
      });
      embed.setColor(ee.color).setImage(guildFinal.iconURL({ size: 1024 }));
      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("change-to-banner")
          .setLabel("Banner")
          .setStyle("Primary")
          .setDisabled(!guildFinal.banner),
        new ButtonBuilder()
          .setURL(guildFinal.iconURL({ size: 1024 }))
          .setLabel("Avatar Link")
          .setStyle("Link")
      );
      const size_menu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .addOptions(
            sizes.map((size) => ({
              label: `${size}x${size}`,
              value: size.toString(),
            }))
          )
          .setCustomId("size_menu")
          .setPlaceholder(`${sizeLanguage}: 1024x1024`)
          .setMaxValues(1)
          .setDisabled(!guildFinal.icon)
      );
      const format_menu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .addOptions(
            formats.map((format) => ({
              label: format.toUpperCase(),
              value: format,
            }))
          )
          .setCustomId("format_menu")
          .setPlaceholder(
            `${formatLanguage}: ${
              guildFinal.iconURL().includes(".gif") ? "GIF" : "WEBP"
            }`
          )
          .setMaxValues(1)
          .setDisabled(!guildFinal.icon)
      );
      const e = await message.reply({
        embeds: [embed],
        components: [size_menu, format_menu, button],
      });
      e.createMessageComponentCollector({ idle: 3e5 })
        .on("collect", async (i) => {
          await i.deferUpdate();
          var size = 1024;
          var format = guildFinal.icon.includes("a_")
            ? "gif"
            : embed.data.image.url.split(".").pop().split("?")[0] || "webp";
          if (i.user.id === message.author.id) {
            if (type === "avatar") {
              size = embed.data.image.url.split("?size=")[1] || 1024;
              format =
                embed.data.image.url.split(".").pop().split("?")[0] || "webp";
              if (i.customId === "change-to-banner") {
                format = guildFinal.banner.includes("a_") ? "gif" : "webp";
                type = "banner";
                change = "user";
                let formats1 = [
                  "jpg",
                  "png",
                  "webp",
                  ...(guildFinal.bannerURL().includes(".gif") ? ["gif"] : []),
                ];
                await button.components[0]
                  .setCustomId("change-to-avatar")
                  .setLabel("Avatar");
                await format_menu.components[0]
                  .setOptions(
                    formats1.map((format) => ({
                      label: format.toUpperCase(),
                      value: format,
                    }))
                  )
                  .setPlaceholder(`${formatLanguage}: ${format.toUpperCase()}`);
                await button.components[1]
                  .setURL(
                    guildFinal.bannerURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  )
                  .setLabel("Banner Link");
                embed.setFields({
                  name: `${fieldTitleLanguage}`,
                  value: [
                    `${animatedLanguage}: ${
                      guildFinal.bannerURL().includes(".gif") ? "Yes" : "No"
                    }`,
                  ]
                    .filter(function (e) {
                      return e;
                    })
                    .join("\n"),
                });
                embed.setImage(
                  guildFinal.bannerURL({
                    forceStatic: true,
                    extension: format,
                    size: Number(size),
                  })
                );
                await i.editReply({
                  embeds: [embed],
                  components: [size_menu, format_menu, button],
                });
              } else if (i.customId === "size_menu") {
                size = i.values[0];
                if (change === "user") {
                  embed.setImage(
                    guildFinal.iconURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    guildFinal.iconURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await size_menu.components[0].setPlaceholder(
                    `${sizeLanguage}: ${size}x${size}`
                  );
                  await i.editReply({
                    embeds: [embed],
                    components: [size_menu, format_menu, button],
                  });
                } else if (change === "server") {
                  embed.setImage(
                    member.iconURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    member.iconURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await size_menu.components[0].setPlaceholder(
                    `${sizeLanguage}: ${size}x${size}`
                  );
                  await i.editReply({
                    embeds: [embed],
                    components: [size_menu, format_menu, button],
                  });
                }
              } else if (i.customId === "format_menu") {
                var format = i.values[0];
                size = embed.data.image.url.split("?size=")[1];
                if (change === "user") {
                  embed.setImage(
                    guildFinal.iconURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    guildFinal.iconURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await format_menu.components[0].setPlaceholder(
                    `${formatLanguage}: ${format.toUpperCase()}`
                  );
                  await i.editReply({
                    embeds: [embed],
                    components: [size_menu, format_menu, button],
                  });
                } else if (change === "server") {
                  embed.setImage(
                    member.iconURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    member.iconURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await format_menu.components[0].setPlaceholder(
                    `${formatLanguage}: ${format.toUpperCase()}`
                  );
                  await i.editReply({
                    embeds: [embed],
                    components: [size_menu, format_menu, button],
                  });
                }
              }
            } else if (type === "banner") {
              size = embed.data.image.url.split("?size=")[1] || 1024;
              format =
                embed.data.image.url.split(".").pop().split("?")[0] || "webp";
              if (i.customId === "change-to-avatar") {
                format = guildFinal.icon.includes("a_") ? "gif" : "webp";
                type = "avatar";
                change = "user";
                let formats3 = [
                  "jpg",
                  "png",
                  "webp",
                  ...(guildFinal.iconURL().includes(".gif") ? ["gif"] : []),
                ];
                await button.components[0]
                  .setCustomId("change-to-banner")
                  .setLabel("Banner");
                await format_menu.components[0]
                  .setOptions(
                    formats3.map((format) => ({
                      label: format.toUpperCase(),
                      value: format,
                    }))
                  )
                  .setPlaceholder(`${formatLanguage}: ${format.toUpperCase()}`);
                await button.components[1]
                  .setURL(
                    guildFinal.iconURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  )
                  .setLabel("Avatar Link");
                embed.setFields({
                  name: `${fieldTitleLanguage}`,
                  value: [
                    `${animatedLanguage}: ${
                      String(guildFinal.iconURL()).includes(".gif")
                        ? "Yes"
                        : "No"
                    }`,
                    `${serverAvatarLanguage}: ${"No"}`,
                  ]
                    .filter(function (e) {
                      return e;
                    })
                    .join("\n"),
                });
                embed.setImage(
                  guildFinal.iconURL({
                    forceStatic: true,
                    extension: format,
                    size: Number(size),
                  })
                );
                await i.editReply({
                  embeds: [embed],
                  components: [size_menu, format_menu, button],
                });
              }
              if (i.customId === "size_menu") {
                size = i.values[0];
                if (change === "user") {
                  embed.setImage(
                    guildFinal.bannerURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    guildFinal.bannerURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await size_menu.components[0].setPlaceholder(
                    `${sizeLanguage}: ${size}x${size}`
                  );
                  await i.editReply({
                    embeds: [embed],
                    components: [size_menu, format_menu, button],
                  });
                }
              } else if (i.customId === "format_menu") {
                var format = i.values[0];
                size = embed.data.image.url.split("?size=")[1];
                if (change === "user") {
                  embed.setImage(
                    guildFinal.bannerURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    guildFinal.bannerURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await format_menu.components[0].setPlaceholder(
                    `${formatLanguage}: ${format.toUpperCase()}`
                  );
                  await i.editReply({
                    embeds: [embed],
                    components: [size_menu, format_menu, button],
                  });
                }
              }
            }
          } else {
            return await i.followUp({
              content: `You Can't Interact With This Command As It Used By Other User`,
              ephemeral: true,
            });
          }
        })
        .on("end", async () => {
          size_menu.components[0].setDisabled(true);
          format_menu.components[0].setDisabled(true);
          button.components[0].setDisabled(true);

          e.edit({ components: [size_menu, format_menu, button] });
        });
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};
