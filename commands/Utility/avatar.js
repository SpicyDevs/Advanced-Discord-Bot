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
  name: "avatar", //the command name for the Slash Command
  slashName: "avatar", //the command name for the Slash Command
  category: "Utility",
  aliases: ["av", "ava"], //the command aliases [OPTIONAL]
  description: "Wanna steal someone's avatar here you go", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [
    //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
    //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ]
    //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
    //{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
    {
      User: {
        name: "user",
        description: "User whoose avatar you want to get?",
        required: false,
      },
    }, //to use in the code: interacton.getUser("ping_a_user")
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
    //let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices
    //const StringOption = options.getString("what_ping"); //same as in StringChoices
    //let UserOption = options.getUser("OPTIONNAME");
    //let ChannelOption = options.getChannel("OPTIONNAME");
    //let RoleOption = options.getRole("OPTIONNAME");
    try {
      let userID = options.getUser("user")
        ? options.getUser("user").id
        : interaction.member.id;
      const sizeLanguage = "Size";
      const serverAvatarLanguage = "Server Avatar";
      const displayAvatarLanguage = "Displayed Avatar Of";
      const displayBannerLanguage = "Displayed Banner";
      const animatedLanguage = "Animated";
      const formatLanguage = "Format";
      const fieldTitleLanguage = "Information:";

      const user = await interaction.client.users.fetch(userID, {
        force: true,
      });
      const memberExists = await interaction.guild.members
        .fetch(userID)
        .then(() => true)
        .catch(() => false);
      const member = await interaction.guild.members.fetch(
        memberExists ? user.id : member.id
      );

      let type = "avatar";
      let sizes = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
      let formats = [
        "jpg",
        "png",
        "webp",
        ...(user.displayAvatarURL().includes(".gif") ? ["gif"] : []),
      ];
      let change = "user";

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${user.tag} Avatar`,
          iconURL: user.displayAvatarURL({ size: 1024 }),
        })
        .setFooter({
          text: `${user.tag} Avatar`,
          iconURL: user.displayAvatarURL(),
        });
      embed.addFields({
        name: `${fieldTitleLanguage}`,
        value: [
          `${animatedLanguage}: ${
            user.displayAvatarURL().includes(".gif") ? "Yes" : "No"
          }`,
          `${serverAvatarLanguage}: No`,
        ]
          .filter(function (e) {
            return e;
          })
          .join("\n"),
      });
      embed.setColor(ee.color).setImage(user.displayAvatarURL({ size: 1024 }));
      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("change-to-banner")
          .setLabel("Banner")
          .setStyle("Primary")
          .setDisabled(!user.banner),
        new ButtonBuilder()
          .setURL(user.displayAvatarURL({ size: 1024 }))
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
          .setDisabled(!user.avatar)
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
              user.displayAvatarURL().includes(".gif") ? "GIF" : "WEBP"
            }`
          )
          .setMaxValues(1)
          .setDisabled(!user.avatar)
      );
      const change_menu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .addOptions({ label: "Server", value: "server" })
          .setCustomId("change_menu")
          .setPlaceholder(`${displayAvatarLanguage}: User`)
          .setMaxValues(1)
      );
      if (memberExists === false) {
        await change_menu.components[0].setDisabled(true);
      } else {
        if (member.displayAvatarURL() === user.displayAvatarURL()) {
          await change_menu.components[0].setDisabled(true);
        } else {
          await change_menu.components[0].setDisabled(false);
        }
      }
      const e = await interaction.reply({
        embeds: [embed],
        components: [size_menu, format_menu, change_menu, button],
      });
      e.createMessageComponentCollector({ idle: 3e5 })
        .on("collect", async (i) => {
          await i.deferUpdate();
          var size = 1024;
          var format = user.avatar.includes("a_")
            ? "gif"
            : embed.data.image.url.split(".").pop().split("?")[0] || "webp";
          if (i.user.id === member.id) {
            if (type === "avatar") {
              size = embed.data.image.url.split("?size=")[1] || 1024;
              format =
                embed.data.image.url.split(".").pop().split("?")[0] || "webp";
              if (i.customId === "change-to-banner") {
                format = user.banner.includes("a_") ? "gif" : "webp";
                type = "banner";
                change = "user";
                let formats1 = [
                  "jpg",
                  "png",
                  "webp",
                  ...(user.bannerURL().includes(".gif") ? ["gif"] : []),
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
                    user.bannerURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  )
                  .setLabel("Banner Link");
                await change_menu.components[0]
                  .setPlaceholder(`${displayBannerLanguage}: User`)
                  .setDisabled(true);
                embed.setFields({
                  name: `${fieldTitleLanguage}`,
                  value: [
                    `${animatedLanguage}: ${
                      user.bannerURL().includes(".gif") ? "Yes" : "No"
                    }`,
                  ]
                    .filter(function (e) {
                      return e;
                    })
                    .join("\n"),
                });
                embed.setImage(
                  user.bannerURL({
                    forceStatic: true,
                    extension: format,
                    size: Number(size),
                  })
                );
                await i.editReply({
                  embeds: [embed],
                  components: [size_menu, format_menu, change_menu, button],
                });
              }
              if (i.customId === "change_menu") {
                if (i.values[0] === "server") {
                  let formats1 = [
                    "jpg",
                    "png",
                    "webp",
                    ...(member.displayAvatarURL().includes(".gif")
                      ? ["gif"]
                      : []),
                  ];
                  change = "server";
                  format = member.displayAvatarURL().includes("a_")
                    ? "gif"
                    : "webp";
                  embed.setFields({
                    name: `${fieldTitleLanguage}`,
                    value: [
                      `${animatedLanguage}: ${
                        String(member.displayAvatarURL()).includes(".gif")
                          ? "Yes"
                          : "No"
                      }`,
                      `${serverAvatarLanguage}: ${"Yes"}`,
                    ]
                      .filter(function (e) {
                        return e;
                      })
                      .join("\n"),
                  });
                  embed.setImage(
                    member.displayAvatarURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await change_menu.components[0]
                    .setOptions({ label: "User", value: "user" })
                    .setPlaceholder(`${displayAvatarLanguage}: Server`);
                  await format_menu.components[0]
                    .setOptions(
                      formats1.map((format) => ({
                        label: format.toUpperCase(),
                        value: format,
                      }))
                    )
                    .setPlaceholder(
                      `${formatLanguage}: ${format.toUpperCase()}`
                    );
                  await button.components[1].setURL(
                    member.displayAvatarURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await i.editReply({
                    embeds: [embed],
                    components: [size_menu, format_menu, change_menu, button],
                  });
                } else if (i.values[0] === "user") {
                  let formats2 = [
                    "jpg",
                    "png",
                    "webp",
                    ...(user.displayAvatarURL().includes(".gif")
                      ? ["gif"]
                      : []),
                  ];
                  change = "user";
                  format = user.displayAvatarURL().includes("a_")
                    ? "gif"
                    : "webp";
                  embed.setFields({
                    name: `${fieldTitleLanguage}`,
                    value: [
                      `${animatedLanguage}: ${
                        String(user.avatarURL()).includes(".gif") ? "Yes" : "No"
                      }`,
                      `${serverAvatarLanguage}: ${"No"}`,
                    ]
                      .filter(function (e) {
                        return e;
                      })
                      .join("\n"),
                  });
                  embed.setImage(
                    user.avatarURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await change_menu.components[0]
                    .setOptions({ label: "Server", value: "server" })
                    .setPlaceholder(`${displayAvatarLanguage}: User`);
                  await format_menu.components[0]
                    .setOptions(
                      formats2.map((format) => ({
                        label: format.toUpperCase(),
                        value: format,
                      }))
                    )
                    .setPlaceholder(
                      `${formatLanguage}: ${format.toUpperCase()}`
                    );
                  await button.components[1].setURL(
                    user.avatarURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await i.editReply({
                    embeds: [embed],
                    components: [size_menu, format_menu, change_menu, button],
                  });
                }
              } else if (i.customId === "size_menu") {
                size = i.values[0];
                if (change === "user") {
                  embed.setImage(
                    user.displayAvatarURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    user.displayAvatarURL({
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
                    components: [size_menu, format_menu, change_menu, button],
                  });
                } else if (change === "server") {
                  embed.setImage(
                    member.displayAvatarURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    member.displayAvatarURL({
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
                    components: [size_menu, format_menu, change_menu, button],
                  });
                }
              } else if (i.customId === "format_menu") {
                var format = i.values[0];
                size = embed.data.image.url.split("?size=")[1];
                if (change === "user") {
                  embed.setImage(
                    user.displayAvatarURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    user.displayAvatarURL({
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
                    components: [size_menu, format_menu, change_menu, button],
                  });
                } else if (change === "server") {
                  embed.setImage(
                    member.displayAvatarURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    member.displayAvatarURL({
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
                    components: [size_menu, format_menu, change_menu, button],
                  });
                }
              }
            } else if (type === "banner") {
              size = embed.data.image.url.split("?size=")[1] || 1024;
              format =
                embed.data.image.url.split(".").pop().split("?")[0] || "webp";
              if (i.customId === "change-to-avatar") {
                format = user.displayAvatarURL().includes("a_")
                  ? "gif"
                  : "webp";
                type = "avatar";
                change = "user";
                let formats3 = [
                  "jpg",
                  "png",
                  "webp",
                  ...(user.displayAvatarURL().includes(".gif") ? ["gif"] : []),
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
                    user.displayAvatarURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  )
                  .setLabel("Avatar Link");
                await change_menu.components[0]
                  .setPlaceholder(`${displayAvatarLanguage}: User`)
                  .setOptions({ label: "Server", value: "server" });
                if (memberExists === false) {
                  await change_menu.components[0].setDisabled(true);
                } else {
                  if (member.displayAvatarURL() === user.displayAvatarURL()) {
                    await change_menu.components[0].setDisabled(true);
                  } else {
                    await change_menu.components[0].setDisabled(false);
                  }
                }
                embed.setFields({
                  name: `${fieldTitleLanguage}`,
                  value: [
                    `${animatedLanguage}: ${
                      String(user.displayAvatarURL()).includes(".gif")
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
                  user.displayAvatarURL({
                    forceStatic: true,
                    extension: format,
                    size: Number(size),
                  })
                );
                await i.editReply({
                  embeds: [embed],
                  components: [size_menu, format_menu, change_menu, button],
                });
              }
              if (i.customId === "size_menu") {
                size = i.values[0];
                if (change === "user") {
                  embed.setImage(
                    user.bannerURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    user.bannerURL({
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
                    components: [size_menu, format_menu, change_menu, button],
                  });
                }
              } else if (i.customId === "format_menu") {
                var format = i.values[0];
                size = embed.data.image.url.split("?size=")[1];
                if (change === "user") {
                  embed.setImage(
                    user.bannerURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    user.bannerURL({
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
                    components: [size_menu, format_menu, change_menu, button],
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
          change_menu.components[0].setDisabled(true);
          size_menu.components[0].setDisabled(true);
          format_menu.components[0].setDisabled(true);
          button.components[0].setDisabled(true);

          e.edit({ components: [size_menu, format_menu, change_menu, button] });
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
      let userID = message.mentions.users.first()
        ? message.mentions.users.first().id
        : args[0]
        ? args[0]
        : message.author.id;
      const sizeLanguage = "Size";
      const serverAvatarLanguage = "Server Avatar";
      const displayAvatarLanguage = "Displayed Avatar Of";
      const displayBannerLanguage = "Displayed Banner";
      const animatedLanguage = "Animated";
      const formatLanguage = "Format";
      const fieldTitleLanguage = "Information:";

      const user = await message.client.users.fetch(userID, { force: true });
      const memberExists = await message.guild.members
        .fetch(userID)
        .then(() => true)
        .catch(() => false);
      const member = await message.guild.members.fetch(
        memberExists ? user.id : message.author.id
      );

      let type = "avatar";
      let sizes = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
      let formats = [
        "jpg",
        "png",
        "webp",
        ...(user.displayAvatarURL().includes(".gif") ? ["gif"] : []),
      ];
      let change = "user";

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${user.tag} Avatar`,
          iconURL: user.displayAvatarURL({ size: 1024 }),
        })
        .setFooter({
          text: `${user.tag} Avatar`,
          iconURL: user.displayAvatarURL(),
        });
      embed.addFields({
        name: `${fieldTitleLanguage}`,
        value: [
          `${animatedLanguage}: ${
            user.displayAvatarURL().includes(".gif") ? "Yes" : "No"
          }`,
          `${serverAvatarLanguage}: No`,
        ]
          .filter(function (e) {
            return e;
          })
          .join("\n"),
      });
      embed.setColor(ee.color).setImage(user.displayAvatarURL({ size: 1024 }));
      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("change-to-banner")
          .setLabel("Banner")
          .setStyle("Primary")
          .setDisabled(!user.banner),
        new ButtonBuilder()
          .setURL(user.displayAvatarURL({ size: 1024 }))
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
          .setDisabled(!user.avatar)
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
              user.displayAvatarURL().includes(".gif") ? "GIF" : "WEBP"
            }`
          )
          .setMaxValues(1)
          .setDisabled(!user.avatar)
      );
      const change_menu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .addOptions({ label: "Server", value: "server" })
          .setCustomId("change_menu")
          .setPlaceholder(`${displayAvatarLanguage}: User`)
          .setMaxValues(1)
      );
      if (memberExists === false) {
        await change_menu.components[0].setDisabled(true);
      } else {
        if (member.displayAvatarURL() === user.displayAvatarURL()) {
          await change_menu.components[0].setDisabled(true);
        } else {
          await change_menu.components[0].setDisabled(false);
        }
      }
      const e = await message.reply({
        embeds: [embed],
        components: [size_menu, format_menu, change_menu, button],
      });
      e.createMessageComponentCollector({ idle: 3e5 })
        .on("collect", async (i) => {
          await i.deferUpdate();
          var size = 1024;
          var format = user.avatar.includes("a_")
            ? "gif"
            : embed.data.image.url.split(".").pop().split("?")[0] || "webp";
          if (i.user.id === message.author.id) {
            if (type === "avatar") {
              size = embed.data.image.url.split("?size=")[1] || 1024;
              format =
                embed.data.image.url.split(".").pop().split("?")[0] || "webp";
              if (i.customId === "change-to-banner") {
                format = user.banner.includes("a_") ? "gif" : "webp";
                type = "banner";
                change = "user";
                let formats1 = [
                  "jpg",
                  "png",
                  "webp",
                  ...(user.bannerURL().includes(".gif") ? ["gif"] : []),
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
                    user.bannerURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  )
                  .setLabel("Banner Link");
                await change_menu.components[0]
                  .setPlaceholder(`${displayBannerLanguage}: User`)
                  .setDisabled(true);
                embed.setFields({
                  name: `${fieldTitleLanguage}`,
                  value: [
                    `${animatedLanguage}: ${
                      user.bannerURL().includes(".gif") ? "Yes" : "No"
                    }`,
                  ]
                    .filter(function (e) {
                      return e;
                    })
                    .join("\n"),
                });
                embed.setImage(
                  user.bannerURL({
                    forceStatic: true,
                    extension: format,
                    size: Number(size),
                  })
                );
                await i.editReply({
                  embeds: [embed],
                  components: [size_menu, format_menu, change_menu, button],
                });
              }
              if (i.customId === "change_menu") {
                if (i.values[0] === "server") {
                  let formats1 = [
                    "jpg",
                    "png",
                    "webp",
                    ...(member.displayAvatarURL().includes(".gif")
                      ? ["gif"]
                      : []),
                  ];
                  change = "server";
                  format = member.displayAvatarURL().includes("a_")
                    ? "gif"
                    : "webp";
                  embed.setFields({
                    name: `${fieldTitleLanguage}`,
                    value: [
                      `${animatedLanguage}: ${
                        String(member.displayAvatarURL()).includes(".gif")
                          ? "Yes"
                          : "No"
                      }`,
                      `${serverAvatarLanguage}: ${"Yes"}`,
                    ]
                      .filter(function (e) {
                        return e;
                      })
                      .join("\n"),
                  });
                  embed.setImage(
                    member.displayAvatarURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await change_menu.components[0]
                    .setOptions({ label: "User", value: "user" })
                    .setPlaceholder(`${displayAvatarLanguage}: Server`);
                  await format_menu.components[0]
                    .setOptions(
                      formats1.map((format) => ({
                        label: format.toUpperCase(),
                        value: format,
                      }))
                    )
                    .setPlaceholder(
                      `${formatLanguage}: ${format.toUpperCase()}`
                    );
                  await button.components[1].setURL(
                    member.displayAvatarURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await i.editReply({
                    embeds: [embed],
                    components: [size_menu, format_menu, change_menu, button],
                  });
                } else if (i.values[0] === "user") {
                  let formats2 = [
                    "jpg",
                    "png",
                    "webp",
                    ...(user.displayAvatarURL().includes(".gif")
                      ? ["gif"]
                      : []),
                  ];
                  change = "user";
                  format = user.displayAvatarURL().includes("a_")
                    ? "gif"
                    : "webp";
                  embed.setFields({
                    name: `${fieldTitleLanguage}`,
                    value: [
                      `${animatedLanguage}: ${
                        String(user.avatarURL()).includes(".gif") ? "Yes" : "No"
                      }`,
                      `${serverAvatarLanguage}: ${"No"}`,
                    ]
                      .filter(function (e) {
                        return e;
                      })
                      .join("\n"),
                  });
                  embed.setImage(
                    user.avatarURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await change_menu.components[0]
                    .setOptions({ label: "Server", value: "server" })
                    .setPlaceholder(`${displayAvatarLanguage}: User`);
                  await format_menu.components[0]
                    .setOptions(
                      formats2.map((format) => ({
                        label: format.toUpperCase(),
                        value: format,
                      }))
                    )
                    .setPlaceholder(
                      `${formatLanguage}: ${format.toUpperCase()}`
                    );
                  await button.components[1].setURL(
                    user.avatarURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await i.editReply({
                    embeds: [embed],
                    components: [size_menu, format_menu, change_menu, button],
                  });
                }
              } else if (i.customId === "size_menu") {
                size = i.values[0];
                if (change === "user") {
                  embed.setImage(
                    user.displayAvatarURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    user.displayAvatarURL({
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
                    components: [size_menu, format_menu, change_menu, button],
                  });
                } else if (change === "server") {
                  embed.setImage(
                    member.displayAvatarURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    member.displayAvatarURL({
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
                    components: [size_menu, format_menu, change_menu, button],
                  });
                }
              } else if (i.customId === "format_menu") {
                var format = i.values[0];
                size = embed.data.image.url.split("?size=")[1];
                if (change === "user") {
                  embed.setImage(
                    user.displayAvatarURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    user.displayAvatarURL({
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
                    components: [size_menu, format_menu, change_menu, button],
                  });
                } else if (change === "server") {
                  embed.setImage(
                    member.displayAvatarURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    member.displayAvatarURL({
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
                    components: [size_menu, format_menu, change_menu, button],
                  });
                }
              }
            } else if (type === "banner") {
              size = embed.data.image.url.split("?size=")[1] || 1024;
              format =
                embed.data.image.url.split(".").pop().split("?")[0] || "webp";
              if (i.customId === "change-to-avatar") {
                format = user.displayAvatarURL().includes("a_")
                  ? "gif"
                  : "webp";
                type = "avatar";
                change = "user";
                let formats3 = [
                  "jpg",
                  "png",
                  "webp",
                  ...(user.displayAvatarURL().includes(".gif") ? ["gif"] : []),
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
                    user.displayAvatarURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  )
                  .setLabel("Avatar Link");
                await change_menu.components[0]
                  .setPlaceholder(`${displayAvatarLanguage}: User`)
                  .setOptions({ label: "Server", value: "server" });
                if (memberExists === false) {
                  await change_menu.components[0].setDisabled(true);
                } else {
                  if (member.displayAvatarURL() === user.displayAvatarURL()) {
                    await change_menu.components[0].setDisabled(true);
                  } else {
                    await change_menu.components[0].setDisabled(false);
                  }
                }
                embed.setFields({
                  name: `${fieldTitleLanguage}`,
                  value: [
                    `${animatedLanguage}: ${
                      String(user.displayAvatarURL()).includes(".gif")
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
                  user.displayAvatarURL({
                    forceStatic: true,
                    extension: format,
                    size: Number(size),
                  })
                );
                await i.editReply({
                  embeds: [embed],
                  components: [size_menu, format_menu, change_menu, button],
                });
              }
              if (i.customId === "size_menu") {
                size = i.values[0];
                if (change === "user") {
                  embed.setImage(
                    user.bannerURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    user.bannerURL({
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
                    components: [size_menu, format_menu, change_menu, button],
                  });
                }
              } else if (i.customId === "format_menu") {
                var format = i.values[0];
                size = embed.data.image.url.split("?size=")[1];
                if (change === "user") {
                  embed.setImage(
                    user.bannerURL({
                      size: Number(size),
                      extension: format,
                      forceStatic: true,
                    })
                  );
                  await button.components[1].setURL(
                    user.bannerURL({
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
                    components: [size_menu, format_menu, change_menu, button],
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
          change_menu.components[0].setDisabled(true);
          size_menu.components[0].setDisabled(true);
          format_menu.components[0].setDisabled(true);
          button.components[0].setDisabled(true);

          e.edit({ components: [size_menu, format_menu, change_menu, button] });
        });
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};
