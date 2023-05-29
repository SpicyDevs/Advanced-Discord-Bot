const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const config = require("../../botconfig/config.js");
const ee = require("../../botconfig/embed.js");
const settings = require("../../botconfig/settings.js");
const captchaSchema = require("../../database/schemas/setups/captcha.js");
module.exports = {
  name: "setup-captcha", //the command name for the Slash Command
  slashName: "captcha", //the command name for the Slash Command
  category: "Setup",
  aliases: [], //the command aliases [OPTIONAL]
  description: "Setup captcha verification in your server", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [PermissionFlagsBits.ManageGuild], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
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
      const data = await captchaSchema.findOne({ guildID: guild.id });
      if (data) {
        const msg = await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Captcha Verification System")
              .setDescription(
                "Captcha verification is already setup in this server \n Do you want to reset it?"
              )
              .setColor(ee.color),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setLabel("Yes")
                .setCustomId("yes"),
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel("No")
                .setCustomId("no")
            ),
          ],
        });
        const filter = (i) =>
          i.user.id === member.user.id;
        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          time: 60000,
        });
        collector.on("collect", async (i) => {
          
          if (i.customId === "yes") {
            collector.stop();
            i.deferUpdate();
            await captchaSchema.findOneAndDelete({
              guildID: guild.id,
            });
            await msg.edit({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Captcha Verification System")
                  .setDescription(
                    "Successfully resetted the captcha verification system"
                  )
                  .setColor(ee.color),
              ],
              components: [],
            });
          } else if (i.customId === "no") {
            collector.stop();
            await msg.edit({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Captcha Verification System")
                  .setDescription("Successfully cancelled the reset")
                  .setColor(ee.color),
              ],
              components: [],
            });
          }
          return;
        });
        collector.on("end", async (collected) => {
          if (collected.size === 0) {
            await msg.edit({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Captcha Verification System")
                  .setDescription(`You took too long!`)
                  .setColor(ee.color),
              ],
              components: [],
            });
          }
        });
        return;
      }
      let captchaChannel = undefined,
        captchaRole = undefined,
        captchaTimeout = undefined,
        captchaAttempts = undefined,
        captchaPunishment = "none";
      const msg = await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Captcha Verification System")
            .setDescription(
              "Do you want to **setup captcha verification** in this server?"
            )
            .setColor(ee.color),
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setStyle(ButtonStyle.Success)
              .setLabel("Yes")
              .setCustomId("yes"),
            new ButtonBuilder()
              .setStyle(ButtonStyle.Danger)
              .setLabel("No")
              .setCustomId("no")
          ),
        ],
      });
      const filter = (i) => i.user.id === member.user.id;
      const collector_main = interaction.channel.createMessageComponentCollector({
        filter,
        time: 60000,
      });
      collector_main.on("collect", async (i) => {
        if (i.customId === "yes") {
          collector_main.stop();
          await i.deferUpdate();
          await msg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle("Captcha Verification System")
                .setDescription(
                  `Please mention the **channel** where you want to send the captcha verification message or type \`skip\` to skip this step \n\n **Note:** The bot needs to have access to this channel and the channel needs to be in this server \n\n **Note:** If you want to skip this step, user will have to run ${client.config.prefix}verify to get the captcha verification message`
                )
                .setColor(ee.color),
            ],
            components: [],
          });
          const filter_channel = (m) => m.author.id === member.user.id;
          const collector_channel = interaction.channel.createMessageCollector({
            filter: filter_channel,
            time: 60000,
          });
          collector_channel.on("collect", async (mchannel) => {
            if (mchannel.content.toLowerCase() === "skip") {
              collector_channel.stop();
              captchaChannel = "skip";
              await msg.edit({
                embeds: [
                  new EmbedBuilder()
                    .setTitle("Captcha Verification System")
                    .setDescription(
                      `Please mention the **role** which will be given to the user after they verify \n\n **Note:** The bot needs to have access to this role and the role must be below the bot's highest role`
                    )
                    .setColor(ee.color),
                ],
                components: [],
              });
            } else {
              const channel =
                mchannel.mentions.channels.first() ||
                guild.channels.cache.get(m.content);
              if (!channel) {
                mchannel
                  .reply({
                    content: `**Invalid channel!** Please try again`,
                  })
                  .then((ms) => setTimeout(() => ms.delete(), 5000))
                  .catch((e) => true);
                await mchannel.delete().catch((e) => true);
                return;
              } else {
                collector_channel.stop();
                captchaChannel = channel.id;
                await mchannel.delete().catch((e) => true);
                await msg.edit({
                  embeds: [
                    new EmbedBuilder()
                      .setTitle("Captcha Verification System")
                      .setDescription(
                        `Please mention the **role** which will be given to the user after they verify \n\n **Note:** The bot needs to have access to this role and the role must be below the bot's highest role`
                      )
                      .setColor(ee.color),
                  ],
                  components: [],
                });
              }
            }
            const filter_role = (mrole) =>
              mrole.author.id === member.user.id;
            const collector_role = interaction.channel.createMessageCollector({
              filter: filter_role,
              time: 60000,
            });
            collector_role.on("collect", async (mrole) => {
              const role =
                mrole.mentions.roles.first() ||
                guild.roles.cache.get(mrole.content);
              if (!role) {
                mrole
                  .reply({
                    content: `**Invalid role!** Please try again`,
                  })
                  .then((ms) => setTimeout(() => ms.delete(), 5000))
                  .catch((e) => true);
                await mrole.delete().catch((e) => true);
                return;
              } else {
                captchaRole = role.id;
                collector_role.stop();
                await mrole.delete().catch((e) => true);
                await msg.edit({
                  embeds: [
                    new EmbedBuilder()
                      .setTitle("Captcha Verification System")
                      .setDescription(
                        `Please enter the time in **minutes** after which the user will be kicked if they don't verify`
                      )
                      .setColor(ee.color),
                  ],
                  components: [],
                });
                const filter_time = (mtime) =>
                  mtime.author.id === member.user.id;
                const collector_time = interaction.channel.createMessageCollector({
                  filter: filter_time,
                  time: 60000,
                });
                collector_time.on("collect", async (mtime) => {
                  const time = mtime.content;
                  if (isNaN(time)) {
                    mtime
                      .reply({
                        content: `Invalid time! Please try again`,
                      })
                      .then((ms) => setTimeout(() => ms.delete(), 5000))
                      .catch((e) => true);
                    await mtime.delete().catch((e) => true);
                    return;
                  } else {
                    captchaTimeout = time;
                    collector_time.stop();
                    await mtime.delete().catch((e) => true);
                    await msg.edit({
                      embeds: [
                        new EmbedBuilder()
                          .setTitle("Captcha Verification System")
                          .setDescription(
                            `Please enter the number of attempts the user will get to verify`
                          )
                          .setColor(ee.color),
                      ],
                      components: [],
                    });
                    const filter_attempts = (mattempts) =>
                      mattempts.author.id === member.user.id;
                    const collector_attempts =
                    interaction.channel.createMessageCollector({
                        filter: filter_attempts,
                        time: 60000,
                      });
                    collector_attempts.on("collect", async (mattempts) => {
                      const attempts = mattempts.content;
                      if (isNaN(attempts)) {
                        mattempts
                          .reply({
                            content: `Invalid attempts! Please try again`,
                          })
                          .then((ms) => setTimeout(() => ms.delete(), 5000))
                          .catch((e) => true);
                        await mattempts.delete().catch((e) => true);
                        return;
                      } else {
                        captchaAttempts = attempts;
                        collector_attempts.stop();
                        await mattempts.delete().catch((e) => true);
                        await msg.edit({
                          embeds: [
                            new EmbedBuilder()
                              .setTitle("Captcha Verification System")
                              .setDescription(
                                `Please choose the punishment which will be given to the user if they fail to verify after the given attempts or the time runs out!`
                              )
                              .setColor(ee.color),
                          ],
                          components: [
                            new ActionRowBuilder().addComponents(
                              new ButtonBuilder()
                                .setCustomId("ban")
                                .setLabel("Ban")
                                .setStyle(ButtonStyle.Success),
                              new ButtonBuilder()
                                .setCustomId("kick")
                                .setLabel("Kick")
                                .setStyle(ButtonStyle.Success),
                              new ButtonBuilder()
                                .setCustomId("none")
                                .setLabel("None")
                                .setStyle(ButtonStyle.Success)
                            ),
                          ],
                        });
                        const filter_punishment = (mpunishment) =>
                          mpunishment.user.id === member.user.id;
                        const collector_punishment =
                        interaction.channel.createMessageComponentCollector({
                            filter: filter_punishment,
                            time: 60000,
                          });
                        collector_punishment.on(
                          "collect",
                          async (mpunishment) => {
                            collector_punishment.stop();
                            mpunishment.deferUpdate();
                            if (mpunishment.customId === "ban") {
                              captchaPunishment = "ban";
                            }
                            if (mpunishment.customId === "kick") {
                              captchaPunishment = "kick";
                            }
                            if (mpunishment.customId === "none") {
                              captchaPunishment = "none";
                            }
                            await msg.edit({
                              embeds: [
                                new EmbedBuilder()
                                  .setTitle("Captcha Verification System")
                                  .setDescription(
                                    `Is this information correct?`
                                  )
                                  .addFields(
                                    {
                                      name: `Channel`,
                                      value:
                                        captchaChannel === "skip"
                                          ? "Not set"
                                          : `<#${captchaChannel}>`,
                                      inline: true,
                                    },
                                    {
                                      name: `Role`,
                                      value: `<@&${captchaRole}>`,
                                      inline: true,
                                    },
                                    {
                                      name: `Time`,
                                      value: `\`${captchaTimeout}\` minutes`,
                                      inline: true,
                                    },
                                    {
                                      name: `Attempts`,
                                      value: `\`${captchaAttempts}\` attempts`,
                                      inline: true,
                                    },
                                    {
                                      name: `Punishment`,
                                      value: `${captchaPunishment}`,
                                      inline: true,
                                    }
                                  )
                                  .setColor(ee.color),
                              ],
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
                            const filter_correct = (mcorrect) =>
                              mcorrect.user.id === member.user.id;
                            const collector_correct =
                            interaction.channel.createMessageComponentCollector({
                                filter: filter_correct,
                                time: 60000,
                              });
                            collector_correct.on(
                              "collect",
                              async (mcorrect) => {
                                if (mcorrect.customId === "yes") {
                                  captchaSchema.findOne(
                                    {
                                      guildID: guild.id,
                                    },
                                  ).then(async (captchaCreated) => {
                                    if (captchaCreated) {
                                      captchaCreated.delete();
                                    }
                                  });
                                  captchaCreate = new captchaSchema({
                                    guildID: guild.id,
                                    channelID: captchaChannel,
                                    roleID: captchaRole,
                                    timeout: captchaTimeout,
                                    attempts: captchaAttempts,
                                    punishment: captchaPunishment,
                                  })
                                  captchaCreate.save();
                                  await msg.edit({
                                    embeds: [
                                      new EmbedBuilder()
                                        .setTitle("Captcha Verification System")
                                        .setDescription(
                                          `Successfully set up the captcha verification system!`
                                        )
                                        .setColor(ee.color),
                                    ],
                                    components: [],
                                  });
                                }
                                if (mcorrect.customId === "no") {
                                  await msg.edit({
                                    embeds: [
                                      new EmbedBuilder()
                                        .setTitle("Captcha Verification System")
                                        .setDescription(`Cancelled the setup!`)
                                        .setColor(ee.color),
                                    ],
                                    components: [],
                                  });
                                }
                                collector_correct.stop();
                                mcorrect.deferUpdate();
                              }
                            );
                            collector_correct.on("end", async (collected) => {
                              if (collected.size === 0) {
                                await msg.edit({
                                  embeds: [
                                    new EmbedBuilder()
                                      .setTitle("Captcha Verification System")
                                      .setDescription(`You took too long!`)
                                      .setColor(ee.color),
                                  ],
                                  components: [],
                                });
                              }
                            });
                          }
                        );
                        collector_punishment.on("end", async (collected) => {
                          if (collected.size === 0) {
                            await msg.edit({
                              embeds: [
                                new EmbedBuilder()
                                  .setTitle("Captcha Verification System")
                                  .setDescription(`You took too long!`)
                                  .setColor(ee.color),
                              ],
                              components: [],
                            });
                          }
                        });
                      }
                    });
                    collector_attempts.on("end", async (collected) => {
                      if (collected.size === 0) {
                        await msg.edit({
                          embeds: [
                            new EmbedBuilder()
                              .setTitle("Captcha Verification System")
                              .setDescription(`You took too long!`)
                              .setColor(ee.color),
                          ],
                          components: [],
                        });
                      }
                    });
                  }
                });
                collector_time.on("end", async (collected) => {
                  if (collected.size === 0) {
                    await msg.edit({
                      embeds: [
                        new EmbedBuilder()
                          .setTitle("Captcha Verification System")
                          .setDescription(`You took too long!`)
                          .setColor(ee.color),
                      ],
                      components: [],
                    });
                  }
                });
              }
            });
            collector_role.on("end", async (collected) => {
              if (collected.size === 0) {
                await msg.edit({
                  embeds: [
                    new EmbedBuilder()
                      .setTitle("Captcha Verification System")
                      .setDescription(`You took too long!`)
                      .setColor(ee.color),
                  ],
                  components: [],
                });
              }
            });
          });
          collector_channel.on("end", async (collected) => {
            if (collected.size === 0) {
              await msg.edit({
                embeds: [
                  new EmbedBuilder()
                    .setTitle("Captcha Verification System")
                    .setDescription(`You took too long!`)
                    .setColor(ee.color),
                ],
                components: [],
              });
            }
          });
        } else if (interaction.customId === "no") {
          await msg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle("Captcha Verification System")
                .setDescription(`Successfully cancelled the setup`)
                .setColor(ee.color),
            ],
            components: [],
          });
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
      const data = await captchaSchema.findOne({ guildID: message.guild.id });
      if (data) {
        const msg = await message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Captcha Verification System")
              .setDescription(
                "Captcha verification is already setup in this server \n Do you want to reset it?"
              )
              .setColor(ee.color),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setLabel("Yes")
                .setCustomId("yes"),
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel("No")
                .setCustomId("no")
            ),
          ],
        });
        const filter = (interaction) =>
          interaction.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({
          filter,
          time: 60000,
        });
        collector.on("collect", async (interaction) => {
          interaction.deferUpdate();
          if (interaction.customId === "yes") {
            collector.stop();
            await captchaSchema.findOneAndDelete({
              guildID: message.guild.id,
            });
            await msg.edit({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Captcha Verification System")
                  .setDescription(
                    "Successfully resetted the captcha verification system"
                  )
                  .setColor(ee.color),
              ],
              components: [],
            });
          } else if (interaction.customId === "no") {
            collector.stop();
            await msg.edit({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Captcha Verification System")
                  .setDescription("Successfully cancelled the reset")
                  .setColor(ee.color),
              ],
              components: [],
            });
          }
        });
        collector.on("end", async (collected) => {
          if (collected.size === 0) {
            await msg.edit({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Captcha Verification System")
                  .setDescription(`You took too long!`)
                  .setColor(ee.color),
              ],
              components: [],
            });
          }
        });
      }
      let captchaChannel = undefined,
        captchaRole = undefined,
        captchaTimeout = undefined,
        captchaAttempts = undefined,
        captchaPunishment = "none";
      const msg = await message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Captcha Verification System")
            .setDescription(
              "Do you want to **setup captcha verification** in this server?"
            )
            .setColor(ee.color),
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setStyle(ButtonStyle.Success)
              .setLabel("Yes")
              .setCustomId("yes"),
            new ButtonBuilder()
              .setStyle(ButtonStyle.Danger)
              .setLabel("No")
              .setCustomId("no")
          ),
        ],
      });
      const filter = (interaction) => interaction.user.id === message.author.id;
      const collector_main = message.channel.createMessageComponentCollector({
        filter,
        time: 60000,
      });
      collector_main.on("collect", async (interaction) => {
        if (interaction.customId === "yes") {
          collector_main.stop();
          await interaction.deferUpdate();
          await msg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle("Captcha Verification System")
                .setDescription(
                  `Please mention the **channel** where you want to send the captcha verification message or type \`skip\` to skip this step \n\n **Note:** The bot needs to have access to this channel and the channel needs to be in this server \n\n **Note:** If you want to skip this step, user will have to run ${client.config.prefix}verify to get the captcha verification message`
                )
                .setColor(ee.color),
            ],
            components: [],
          });
          const filter_channel = (m) => m.author.id === message.author.id;
          const collector_channel = message.channel.createMessageCollector({
            filter: filter_channel,
            time: 60000,
          });
          collector_channel.on("collect", async (mchannel) => {
            if (mchannel.content.toLowerCase() === "skip") {
              collector_channel.stop();
              captchaChannel = "skip";
              await msg.edit({
                embeds: [
                  new EmbedBuilder()
                    .setTitle("Captcha Verification System")
                    .setDescription(
                      `Please mention the **role** which will be given to the user after they verify \n\n **Note:** The bot needs to have access to this role and the role must be below the bot's highest role`
                    )
                    .setColor(ee.color),
                ],
                components: [],
              });
            } else {
              const channel =
                mchannel.mentions.channels.first() ||
                message.guild.channels.cache.get(m.content);
              if (!channel) {
                mchannel
                  .reply({
                    content: `**Invalid channel!** Please try again`,
                  })
                  .then((ms) => setTimeout(() => ms.delete(), 5000))
                  .catch((e) => true);
                await mchannel.delete().catch((e) => true);
                return;
              } else {
                collector_channel.stop();
                captchaChannel = channel.id;
                await mchannel.delete().catch((e) => true);
                await msg.edit({
                  embeds: [
                    new EmbedBuilder()
                      .setTitle("Captcha Verification System")
                      .setDescription(
                        `Please mention the **role** which will be given to the user after they verify \n\n **Note:** The bot needs to have access to this role and the role must be below the bot's highest role`
                      )
                      .setColor(ee.color),
                  ],
                  components: [],
                });
              }
            }
            const filter_role = (mrole) =>
              mrole.author.id === message.author.id;
            const collector_role = message.channel.createMessageCollector({
              filter: filter_role,
              time: 60000,
            });
            collector_role.on("collect", async (mrole) => {
              const role =
                mrole.mentions.roles.first() ||
                message.guild.roles.cache.get(mrole.content);
              if (!role) {
                mrole
                  .reply({
                    content: `**Invalid role!** Please try again`,
                  })
                  .then((ms) => setTimeout(() => ms.delete(), 5000))
                  .catch((e) => true);
                await mrole.delete().catch((e) => true);
                return;
              } else {
                captchaRole = role.id;
                collector_role.stop();
                await mrole.delete().catch((e) => true);
                await msg.edit({
                  embeds: [
                    new EmbedBuilder()
                      .setTitle("Captcha Verification System")
                      .setDescription(
                        `Please enter the time in **minutes** after which the user will be kicked if they don't verify`
                      )
                      .setColor(ee.color),
                  ],
                  components: [],
                });
                const filter_time = (mtime) =>
                  mtime.author.id === message.author.id;
                const collector_time = message.channel.createMessageCollector({
                  filter: filter_time,
                  time: 60000,
                });
                collector_time.on("collect", async (mtime) => {
                  const time = mtime.content;
                  if (isNaN(time)) {
                    mtime
                      .reply({
                        content: `Invalid time! Please try again`,
                      })
                      .then((ms) => setTimeout(() => ms.delete(), 5000))
                      .catch((e) => true);
                    await mtime.delete().catch((e) => true);
                    return;
                  } else {
                    captchaTimeout = time;
                    collector_time.stop();
                    await mtime.delete().catch((e) => true);
                    await msg.edit({
                      embeds: [
                        new EmbedBuilder()
                          .setTitle("Captcha Verification System")
                          .setDescription(
                            `Please enter the number of attempts the user will get to verify`
                          )
                          .setColor(ee.color),
                      ],
                      components: [],
                    });
                    const filter_attempts = (mattempts) =>
                      mattempts.author.id === message.author.id;
                    const collector_attempts =
                      message.channel.createMessageCollector({
                        filter: filter_attempts,
                        time: 60000,
                      });
                    collector_attempts.on("collect", async (mattempts) => {
                      const attempts = mattempts.content;
                      if (isNaN(attempts)) {
                        mattempts
                          .reply({
                            content: `Invalid attempts! Please try again`,
                          })
                          .then((ms) => setTimeout(() => ms.delete(), 5000))
                          .catch((e) => true);
                        await mattempts.delete().catch((e) => true);
                        return;
                      } else {
                        captchaAttempts = attempts;
                        collector_attempts.stop();
                        await mattempts.delete().catch((e) => true);
                        await msg.edit({
                          embeds: [
                            new EmbedBuilder()
                              .setTitle("Captcha Verification System")
                              .setDescription(
                                `Please choose the punishment which will be given to the user if they fail to verify after the given attempts or the time runs out!`
                              )
                              .setColor(ee.color),
                          ],
                          components: [
                            new ActionRowBuilder().addComponents(
                              new ButtonBuilder()
                                .setCustomId("ban")
                                .setLabel("Ban")
                                .setStyle(ButtonStyle.Success),
                              new ButtonBuilder()
                                .setCustomId("kick")
                                .setLabel("Kick")
                                .setStyle(ButtonStyle.Success),
                              new ButtonBuilder()
                                .setCustomId("none")
                                .setLabel("None")
                                .setStyle(ButtonStyle.Success)
                            ),
                          ],
                        });
                        const filter_punishment = (mpunishment) =>
                          mpunishment.user.id === message.author.id;
                        const collector_punishment =
                          message.channel.createMessageComponentCollector({
                            filter: filter_punishment,
                            time: 60000,
                          });
                        collector_punishment.on(
                          "collect",
                          async (mpunishment) => {
                            collector_punishment.stop();
                            mpunishment.deferUpdate();
                            if (mpunishment.customId === "ban") {
                              captchaPunishment = "ban";
                            }
                            if (mpunishment.customId === "kick") {
                              captchaPunishment = "kick";
                            }
                            if (mpunishment.customId === "none") {
                              captchaPunishment = "none";
                            }
                            await msg.edit({
                              embeds: [
                                new EmbedBuilder()
                                  .setTitle("Captcha Verification System")
                                  .setDescription(
                                    `Is this information correct?`
                                  )
                                  .addFields(
                                    {
                                      name: `Channel`,
                                      value:
                                        captchaChannel === "skip"
                                          ? "Not set"
                                          : `<#${captchaChannel}>`,
                                      inline: true,
                                    },
                                    {
                                      name: `Role`,
                                      value: `<@&${captchaRole}>`,
                                      inline: true,
                                    },
                                    {
                                      name: `Time`,
                                      value: `\`${captchaTimeout}\` minutes`,
                                      inline: true,
                                    },
                                    {
                                      name: `Attempts`,
                                      value: `\`${captchaAttempts}\` attempts`,
                                      inline: true,
                                    },
                                    {
                                      name: `Punishment`,
                                      value: `${captchaPunishment}`,
                                      inline: true,
                                    }
                                  )
                                  .setColor(ee.color),
                              ],
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
                            const filter_correct = (mcorrect) =>
                              mcorrect.user.id === message.author.id;
                            const collector_correct =
                              message.channel.createMessageComponentCollector({
                                filter: filter_correct,
                                time: 60000,
                              });
                            collector_correct.on(
                              "collect",
                              async (mcorrect) => {
                                if (mcorrect.customId === "yes") {
                                  captchaSchema.findOne(
                                    {
                                      guildID: message.guild.id,
                                    },
                                  ).then(async (captchaCreated) => {
                                    if (captchaCreated) {
                                      captchaCreated.delete();
                                    }
                                  });
                                  captchaCreate = new captchaSchema({
                                    guildID: message.guild.id,
                                    channelID: captchaChannel,
                                    roleID: captchaRole,
                                    timeout: captchaTimeout,
                                    attempts: captchaAttempts,
                                    punishment: captchaPunishment,
                                  })
                                  captchaCreate.save();
                                  await msg.edit({
                                    embeds: [
                                      new EmbedBuilder()
                                        .setTitle("Captcha Verification System")
                                        .setDescription(
                                          `Successfully set up the captcha verification system!`
                                        )
                                        .setColor(ee.color),
                                    ],
                                    components: [],
                                  });
                                }
                                if (mcorrect.customId === "no") {
                                  await msg.edit({
                                    embeds: [
                                      new EmbedBuilder()
                                        .setTitle("Captcha Verification System")
                                        .setDescription(`Cancelled the setup!`)
                                        .setColor(ee.color),
                                    ],
                                    components: [],
                                  });
                                }
                                collector_correct.stop();
                                mcorrect.deferUpdate();
                              }
                            );
                            collector_correct.on("end", async (collected) => {
                              if (collected.size === 0) {
                                await msg.edit({
                                  embeds: [
                                    new EmbedBuilder()
                                      .setTitle("Captcha Verification System")
                                      .setDescription(`You took too long!`)
                                      .setColor(ee.color),
                                  ],
                                  components: [],
                                });
                              }
                            });
                          }
                        );
                        collector_punishment.on("end", async (collected) => {
                          if (collected.size === 0) {
                            await msg.edit({
                              embeds: [
                                new EmbedBuilder()
                                  .setTitle("Captcha Verification System")
                                  .setDescription(`You took too long!`)
                                  .setColor(ee.color),
                              ],
                              components: [],
                            });
                          }
                        });
                      }
                    });
                    collector_attempts.on("end", async (collected) => {
                      if (collected.size === 0) {
                        await msg.edit({
                          embeds: [
                            new EmbedBuilder()
                              .setTitle("Captcha Verification System")
                              .setDescription(`You took too long!`)
                              .setColor(ee.color),
                          ],
                          components: [],
                        });
                      }
                    });
                  }
                });
                collector_time.on("end", async (collected) => {
                  if (collected.size === 0) {
                    await msg.edit({
                      embeds: [
                        new EmbedBuilder()
                          .setTitle("Captcha Verification System")
                          .setDescription(`You took too long!`)
                          .setColor(ee.color),
                      ],
                      components: [],
                    });
                  }
                });
              }
            });
            collector_role.on("end", async (collected) => {
              if (collected.size === 0) {
                await msg.edit({
                  embeds: [
                    new EmbedBuilder()
                      .setTitle("Captcha Verification System")
                      .setDescription(`You took too long!`)
                      .setColor(ee.color),
                  ],
                  components: [],
                });
              }
            });
          });
          collector_channel.on("end", async (collected) => {
            if (collected.size === 0) {
              await msg.edit({
                embeds: [
                  new EmbedBuilder()
                    .setTitle("Captcha Verification System")
                    .setDescription(`You took too long!`)
                    .setColor(ee.color),
                ],
                components: [],
              });
            }
          });
        } else if (interaction.customId === "no") {
          await msg.edit({
            embeds: [
              new EmbedBuilder()
                .setTitle("Captcha Verification System")
                .setDescription(`Successfully cancelled the setup`)
                .setColor(ee.color),
            ],
            components: [],
          });
        }
      });
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};
