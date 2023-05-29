const Discord = require("discord.js");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const captchaSchema = require("../../database/schemas/setups/captcha.js");
const { generateCaptcha } = require("../../handlers/functions.js");
const { CaptchaGenerator } = require("captcha-canvas");
const config = require("../../botconfig/config.js");
const ee = require("../../botconfig/embed.js");
const settings = require("../../botconfig/settings.js");
module.exports = async (client, member) => {
  //---------------Captcha-Verification-System-----------------//
  const captchaData = await captchaSchema.findOne({
    guildID: member.guild.id,
  });
  if (captchaData) {
    let failed = false;
    const { guildID, roleID, channelID, timeout, attempts, punishment } =
      captchaData;
    const guild = client.guilds.cache.get(guildID);
    const role = guild.roles.cache.get(roleID);
    const channel = guild.channels.cache.get(
      channelID !== "skip" ? channelID : null
    );
    if (
      guild &&
      (channelID === "skip" ||
        (channel &&
          channel.type === Discord.ChannelType.GuildText &&
          channel.viewable &&
          channel
            .permissionsFor(guild.members.me)
            .has([
              Discord.PermissionFlagsBits.ManageMessages,
              Discord.PermissionFlagsBits.SendMessages,
            ]))) &&
      role &&
      role.comparePositionTo(guild.members.me.roles.highest) < 0
    ) {
      if (!member.user.bot) {
        if (channel) {
          const captchaCodes = Array.from({ length: 4 }, () =>
            generateCaptcha(6)
          );

          const buttonsEnabled = captchaCodes.map((code) =>
            new ButtonBuilder()
              .setCustomId(code)
              .setLabel(code)
              .setStyle(ButtonStyle.Secondary)
          );

          const capcthaRowsbuttonsEnabled = [
            new ActionRowBuilder().addComponents(buttonsEnabled[0], buttonsEnabled[1]),
            new ActionRowBuilder().addComponents(buttonsEnabled[2], buttonsEnabled[3]),
          ];
          const buttonsDisabled = captchaCodes.map((code) =>
            new ButtonBuilder()
              .setCustomId(code)
              .setLabel(code)
              .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
          );

          const capcthaRowsbuttonsDisabled = [
            new ActionRowBuilder().addComponents(buttonsDisabled[0], buttonsDisabled[1]),
            new ActionRowBuilder().addComponents(buttonsDisabled[2], buttonsDisabled[3]),
          ];
          const mainCaptchaCode = captchaCodes[Math.floor(Math.random() * 4)];
          const captchaCode = generateCaptcha(6);
          const captcha = new CaptchaGenerator()
            .setDimension(150, 450)
            .setCaptcha({
              text: mainCaptchaCode,
              size: 60,
              color: "green",
            })
            .setDecoy({
              opacity: 1,
            })
            .setTrace({
              color: "white",
            });
          const buffer = captcha.generateSync();
          const newCaptcha = new AttachmentBuilder(buffer, {
            name: "captcha.png",
            description: "Captcha Image",
          });
          const capcthaAskMsg = await channel.send({
            allowedMentions: { parse: ['users'] },
            content: `<@${member.user.id}>`,
            embeds: [
              new EmbedBuilder()
                .setTitle(`Welcome to ${member.guild.name}!`)
                .setDescription(
                  `Please send the captcha code here.
  
              Hello! You are required to complete a captcha before entering the server.
              **NOTE:** **This is Case Sensitive.**
                                                  
              **Your Captcha:**`
                )
                .setImage("attachment://captcha.png")
                .setColor(ee.color),
            ],
            files: [newCaptcha],
            components: capcthaRowsbuttonsEnabled,
          });
            const filterCaptcha = (interaction) => interaction.user.id === member.user.id;
            const collectorCaptcha = channel.createMessageComponentCollector({
                filter: filterCaptcha,
                time: timeout * 60000,
                max: attempts,
            });
            collectorCaptcha.on("collect", async (interaction) => {
                if (interaction.customId === mainCaptchaCode) {
                    failed = false;
                    collectorCaptcha.stop();
                    let verificationEmbed = new EmbedBuilder()
                        .setColor(ee.color)
                        .setDescription(
                            `**You have been verified to: \`${member.guild.name}\`!**`
                        );
                    member.roles.add(role).catch((e) => {return interaction.reply({
                        content: `I am missing permissions to give you the role: ${role}!`,
                        ephemeral: true,
                    })});
                    capcthaAskMsg.edit({
                        embeds: [verificationEmbed],
                        components: capcthaRowsbuttonsDisabled,
                        files: [],
                    });
                    interaction.deferUpdate();
                    setTimeout(async () => {
                        await capcthaAskMsg.delete();
                    }, 10000);

                } else {
                    failed = true;
                    interaction.reply({
                        content: "Wrong Captcha!",
                        ephemeral: true,
                    });
                }
            });
            collectorCaptcha.on("end", async (collected, reason) => {
                if(!failed) return;
                    let verificationEmbed = new EmbedBuilder()
                        .setColor(ee.color)
                        .setDescription(
                            `**You have failed to verify to: \`${member.guild.name}\`!**`
                        );
                        if (punishment.toLowerCase() === "kick") {
                            member.kick("Failed to verify.");
                        } else if (punishment.toLowerCase() === "ban") {
                            member.ban({ reason: "Failed to verify." });
                        }
                        capcthaAskMsg.edit({
                            content: `<@${member.user.id}>`,
                            embeds: [verificationEmbed],
                            components: capcthaRowsbuttonsDisabled,
                            files: [],
                        })
                    capcthaAskMsg.reply({
                        content: `<@${member.user.id}>`,
                        embeds: [verificationEmbed],
                        ephemeral: true,
                    })
                
            }
            );
        }
      }
    }
  }
};
