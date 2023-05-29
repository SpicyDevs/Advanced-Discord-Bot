const config = require(`../../botconfig/config.js`);
const ee = require(`../../botconfig/embed.js`);
const settings = require(`../../botconfig/settings.js`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
const AfkEntry = require(`../../database/schemas/utility/afk.js`);
const Discord = require("discord.js");
const { discordTimestamp } = require("visa2discord");
module.exports = async (client, message) => {
  try {
    //if the message is not in a guild (aka in dms), return aka ignore the inputs
    if (
      !message.guild ||
      message.guild.available === false ||
      !message.channel ||
      message.webhookId ||
      message.author.bot
    )
      return;
    //if the channel is on partial fetch it
    if (message.channel?.partial) await message.channel.fetch().catch(() => {});
    if (message.member?.partial) await message.member.fetch().catch(() => {});
    //AFK SYSTEM

    const afkData = await AfkEntry.findOne({ userID: message.author.id });
    if (afkData) {
      const welcomeEmbed = new Discord.EmbedBuilder()
        .setColor(ee.color)
        .setFooter({ text: ee.footertext, iconURL: ee.footericon })
        .setTitle(`**Welcome back, ${message.author.tag}!**`)
        .setDescription(
          `You were AFK for \`${formatRelativeTime(
            afkData.timestamp
          )}\`. I removed your AFK status.`
        );

      const guildAfk = afkData.guilds.find(
        (guild) => guild.guildID === message.guild.id
      );

      if (afkData.isGlobalAfk) {
        await AfkEntry.deleteOne({ userID: message.author.id });
      } else if (guildAfk) {
        await AfkEntry.updateOne(
          { userID: message.author.id },
          { $pull: { guilds: guildAfk } }
        );
      }

      // Check if the user has no remaining guilds in the AFK entry
      const remainingGuilds = await AfkEntry.findOne({
        userID: message.author.id,
      });
      if (remainingGuilds && remainingGuilds.guilds.length === 0) {
        await AfkEntry.deleteOne({ userID: message.author.id });
      }

      message.reply({ embeds: [welcomeEmbed] }).then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => {
            console.log(String(e).grey);
          });
        }, 5000);
      });
    }

    message.mentions.users.forEach(async (u) => {
      if (
        !message.content.includes("@here") &&
        !message.content.includes("@everyone")
      ) {
        const afkDataPing = await AfkEntry.findOne({ userID: u.id });

        if (afkDataPing) {
          if (afkDataPing.isGlobalAfk) {
            message
              .reply({
                embeds: [
                  new Discord.EmbedBuilder()
                    .setColor(ee.color)
                    .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                    .setTitle(`**${u.tag} is currently AFK!**`)
                    .setDescription(
                      `**Reason:** ${
                        afkDataPing.reason
                      }\n\nThey are AFK since ${discordTimestamp(
                        afkDataPing.timestamp,
                        "R"
                      )}.`
                    ),
                ],
              })
              .then((msg) => {
                setTimeout(() => {
                  msg.delete().catch((e) => {
                    console.log(String(e).grey);
                  });
                }, 5000);
              });
          } else if (
            afkDataPing.guilds.some(
              (guild) => guild.guildID === message.guild.id
            )
          ) {
            const guildAfkData = afkDataPing.guilds.find(
              (guild) => guild.guildID === message.guild.id
            );
            message
              .reply({
                embeds: [
                  new Discord.EmbedBuilder()
                    .setColor(ee.color)
                    .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                    .setTitle(`**${u.tag} is currently AFK!**`)
                    .setDescription(
                      `**Reason:** ${
                        guildAfkData.reason
                      }\n\nThey are AFK since ${discordTimestamp(
                        guildAfkData.timestamp / 1000,
                        "R"
                      )}.`
                    ),
                ],
              })
              .then((msg) => {
                setTimeout(() => {
                  msg.delete().catch((e) => {
                    console.log(String(e).grey);
                  });
                }, 5000);
              });
          } else {
            // User is not AFK in the current guild
            return;
          }
        }
      }
    });

    // if the message  author is a bot, return aka ignore the inputs
    if (message.author.bot) return;
    const prefix = config.prefix;
    const prefixRegex = new RegExp(
      `^(<@!?${client.user.id}>|${escapeRegex(prefix)})`
    );
    if (!prefixRegex.test(message.content)) return;
    const [, mPrefix] = message.content.match(prefixRegex);
    const args = message.content
      .slice(mPrefix.length)
      .trim()
      .split(/ +/)
      .filter(Boolean);
      const cmd = args.length > 0 ? args.shift().toLowerCase() : "";
      const cmdString = args.length > 0 ? cmd + " " + args.join(" ").toLowerCase() : "";
    if (cmd.length == 0 || !cmd) {
      if (mPrefix.includes(client.user.id)) {
        message.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setColor(ee.color)
              .setFooter({ text: ee.footertext, iconURL: ee.footericon })
              .setTitle(`:thumbsup: **My Prefix here, is __\`${prefix}\`__**`),
          ],
        });
      }
      return;
    }
    let command =
    client.commands.get(cmd) ||
    client.commands.get(client.aliases.get(cmd)) ||
    client.commands.get(cmdString) ||
    client.commands.get(client.aliases.get(cmdString));
    if (command) {
      //Check if user is on cooldown with the cmd, with Tomato#6966's Function from /handlers/functions.js
      if (onCoolDown(message, command)) {
        return message.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setColor(ee.wrongcolor)
              .setFooter({ text: ee.footertext, iconURL: ee.footericon })
              .setTitle(
                replacemsg(settings.messages.cooldown, {
                  prefix: prefix,
                  command: command,
                  timeLeft: onCoolDown(message, command),
                })
              ),
          ],
        });
      }
      try {
        //if Command has specific permission return error
        if (
          command.memberpermissions &&
          command.memberpermissions.length > 0 &&
          !message.member.permissions.has(command.memberpermissions)
        ) {
          return message
            .reply({
              embeds: [
                new Discord.EmbedBuilder()
                  .setColor(ee.wrongcolor)
                  .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                  .setTitle(
                    replacemsg(settings.messages.notallowed_to_exec_cmd.title)
                  )
                  .setDescription(
                    replacemsg(
                      settings.messages.notallowed_to_exec_cmd.description
                        .memberpermissions,
                      {
                        command: command,
                        prefix: prefix,
                      }
                    )
                  ),
              ],
            })
            .then((msg) => {
              setTimeout(() => {
                msg.delete().catch((e) => {
                  console.log(String(e).grey);
                });
              }, settings.timeout.notallowed_to_exec_cmd.memberpermissions);
            })
            .catch((e) => {
              console.log(String(e).grey);
            });
        }
        //if Command has specific needed roles return error
        if (
          command.requiredroles &&
          command.requiredroles.length > 0 &&
          message.member.roles.cache.size > 0 &&
          !message.member.roles.cache.some((r) =>
            command.requiredroles.includes(r.id)
          )
        ) {
          return message
            .reply({
              embeds: [
                new Discord.EmbedBuilder()
                  .setColor(ee.wrongcolor)
                  .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                  .setTitle(
                    replacemsg(settings.messages.notallowed_to_exec_cmd.title)
                  )
                  .setDescription(
                    replacemsg(
                      settings.messages.notallowed_to_exec_cmd.description
                        .requiredroles,
                      {
                        command: command,
                        prefix: prefix,
                      }
                    )
                  ),
              ],
            })
            .then((msg) => {
              setTimeout(() => {
                msg.delete().catch((e) => {
                  console.log(String(e).grey);
                });
              }, settings.timeout.notallowed_to_exec_cmd.requiredroles);
            })
            .catch((e) => {
              console.log(String(e).grey);
            });
        }
        //if Command has specific users return error
        if (
          command.alloweduserids &&
          command.alloweduserids.length > 0 &&
          !command.alloweduserids.includes(message.author.id)
        ) {
          return message
            .reply({
              embeds: [
                new Discord.EmbedBuilder()
                  .setColor(ee.wrongcolor)
                  .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                  .setTitle(
                    replacemsg(settings.messages.notallowed_to_exec_cmd.title)
                  )
                  .setDescription(
                    replacemsg(
                      settings.messages.notallowed_to_exec_cmd.description
                        .alloweduserids,
                      {
                        command: command,
                        prefix: prefix,
                      }
                    )
                  ),
              ],
            })
            .then((msg) => {
              setTimeout(() => {
                msg.delete().catch((e) => {
                  console.log(String(e).grey);
                });
              }, settings.timeout.notallowed_to_exec_cmd.alloweduserids);
            })
            .catch((e) => {
              console.log(String(e).grey);
            });
        }
        //if command has minimum args, and user dont entered enough, return error
        if (
          command.minargs &&
          command.minargs > 0 &&
          args.length < command.minargs
        ) {
          return message
            .reply({
              embeds: [
                new Discord.EmbedBuilder()
                  .setColor(ee.wrongcolor)
                  .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                  .setTitle(":x: Wrong Command Usage!")
                  .setDescription(
                    command.argsmissing_message &&
                      command.argsmissing_message.trim().length > 0
                      ? command.argsmissing_message
                      : command.usage
                      ? "Usage: " + command.usage
                      : "Wrong Command Usage"
                  ),
              ],
            })
            .then((msg) => {
              setTimeout(() => {
                msg.delete().catch((e) => {
                  console.log(String(e).grey);
                });
              }, settings.timeout.minargs);
            })
            .catch((e) => {
              console.log(String(e).grey);
            });
        }
        //if command has maximum args, and user enters too many, return error
        if (
          command.maxargs &&
          command.maxargs > 0 &&
          args.length > command.maxargs
        ) {
          return message
            .reply({
              embeds: [
                new Discord.EmbedBuilder()
                  .setColor(ee.wrongcolor)
                  .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                  .setTitle(":x: Wrong Command Usage!")
                  .setDescription(
                    command.argstoomany_message &&
                      command.argstoomany_message.trim().length > 0
                      ? command.argstoomany_message
                      : command.usage
                      ? "Usage: " + command.usage
                      : "Wrong Command Usage"
                  ),
              ],
            })
            .then((msg) => {
              setTimeout(() => {
                msg.delete().catch((e) => {
                  console.log(String(e).grey);
                });
              }, settings.timeout.maxargs);
            })
            .catch((e) => {
              console.log(String(e).grey);
            });
        }

        //if command has minimum args (splitted with "++"), and user dont entered enough, return error
        if (
          command.minplusargs &&
          command.minplusargs > 0 &&
          args.join(" ").split("++").filter(Boolean).length <
            command.minplusargs
        ) {
          return message
            .reply({
              embeds: [
                new Discord.EmbedBuilder()
                  .setColor(ee.wrongcolor)
                  .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                  .setTitle(":x: Wrong Command Usage!")
                  .setDescription(
                    command.argsmissing_message &&
                      command.argsmissing_message.trim().length > 0
                      ? command.argsmissing_message
                      : command.usage
                      ? "Usage: " + command.usage
                      : "Wrong Command Usage"
                  ),
              ],
            })
            .then((msg) => {
              setTimeout(() => {
                msg.delete().catch((e) => {
                  console.log(String(e).grey);
                });
              }, settings.timeout.minplusargs);
            })
            .catch((e) => {
              console.log(String(e).grey);
            });
        }
        //if command has maximum args (splitted with "++"), and user enters too many, return error
        if (
          command.maxplusargs &&
          command.maxplusargs > 0 &&
          args.join(" ").split("++").filter(Boolean).length >
            command.maxplusargs
        ) {
          return message
            .reply({
              embeds: [
                new Discord.EmbedBuilder()
                  .setColor(ee.wrongcolor)
                  .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                  .setTitle(":x: Wrong Command Usage!")
                  .setDescription(
                    command.argstoomany_message &&
                      command.argstoomany_message.trim().length > 0
                      ? command.argsmissing_message
                      : command.usage
                      ? "Usage: " + command.usage
                      : "Wrong Command Usage"
                  ),
              ],
            })
            .then((msg) => {
              setTimeout(() => {
                msg.delete().catch((e) => {
                  console.log(String(e).grey);
                });
              }, settings.timeout.maxplusargs);
            })
            .catch((e) => {
              console.log(String(e).grey);
            });
        }
        //run the command with the parameters:  client, message, args, Cmduser, text, prefix,
        command.messageRun(
          client,
          message,
          args,
          args.join(" ").split("++").filter(Boolean),
          message.member,
          args.join(" "),
          prefix
        );
      } catch (error) {
        if (settings.somethingwentwrong_cmd) {
          return message
            .reply({
              embeds: [
                new Discord.EmbedBuilder()
                  .setColor(ee.wrongcolor)
                  .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                  .setTitle(
                    replacemsg(settings.messages.somethingwentwrong_cmd.title, {
                      prefix: prefix,
                      command: command,
                    })
                  )
                  .setDescription(
                    replacemsg(
                      settings.messages.somethingwentwrong_cmd.description,
                      {
                        error: error,
                        prefix: prefix,
                        command: command,
                      }
                    )
                  ),
              ],
            })
            .then((msg) => {
              setTimeout(() => {
                msg.delete().catch((e) => {
                  console.log(String(e).grey);
                });
              }, 4000);
            })
            .catch((e) => {
              console.log(String(e).grey);
            });
        }
      }
    } //if the command is not found send an info msg
    else
      return message
        .reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setColor(ee.wrongcolor)
              .setFooter({ text: ee.footertext, iconURL: ee.footericon })
              .setTitle(
                replacemsg(settings.messages.unknown_cmd, {
                  prefix: prefix,
                })
              ),
          ],
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete().catch((e) => {
              console.log(String(e).grey);
            });
          }, 4000);
        })
        .catch((e) => {
          console.log(String(e).grey);
        });
  } catch (e) {
    console.log(String(e.stack).grey.bgRed);
  }
};

function escapeRegex(str) {
  try {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch {
    return str;
  }
}

function formatRelativeTime(timestamp) {
  const currentTime = new Date().getTime();
  const timeDifference = currentTime - timestamp;

  // Convert time difference to seconds
  const seconds = Math.floor(timeDifference / 1000);

  if (seconds < 60) {
    return seconds + " seconds ago";
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return minutes + " minutes ago";
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return hours + " hours ago";
  } else {
    const days = Math.floor(seconds / 86400);
    return days + " days ago";
  }
}
