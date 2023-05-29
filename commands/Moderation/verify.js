const { CaptchaGenerator } = require("captcha-canvas");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
  PermissionFlagsBits,
  AttachmentBuilder,
} = require("discord.js");
const config = require("../../botconfig/config.js");
const ee = require("../../botconfig/embed.js");
const settings = require("../../botconfig/settings.js");
const { generateCaptcha } = require("../../handlers/functions.js");
module.exports = {
  name: "verify", //the command name for the Slash Command
  slashName: "verify", //the command name for the Slash Command
  category: "Moderation",
  description: "Set up verification.", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  slashRun: async (client, interaction) => {
    try {
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
    const genCaptcha = generateCaptcha(6);

    const captcha = new CaptchaGenerator()
      .setDimension(150, 450)
      .setCaptcha({
        text: genCaptcha,
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
    const newCaptcha = new AttachmentBuilder(buffer, {name: "captcha.png", description: "Captcha Image"});
    message.channel
      .send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Welcome to ${message.guild.name}!`)
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
      })
      .then(() => {
        const filter = (m) => message.author.id === m.author.id;
        message.channel
          .awaitMessages(filter, {
            time: 5 * 60000,
            max: 1,
            errors: ["time"],
          })
          .then(async (messages) => {
            if (messages.first().content === genCaptcha) {
              message.channel.bulkDelete(3);
              let verificationEmbed = new EmbedBuilder()
                .setAuthor(
                  message.author.username,
                  message.author.avatarURL({
                    dynamic: true,
                  })
                )
                .setColor(colors.green)
                .setDescription(
                  `**You have been verified to: \`${message.guild.name}\`!**`
                );
              //.setFooter(message.client.user.username, message.client.user.avatarURL())
              /*const role = message.guild.roles.cache.find(role => role.name === "Member");
                message.member.roles.add(role);
                */
              await message.channel.send(verificationEmbed).then((m) =>
                m.delete({
                  timeout: 3000,
                })
              );
              console.log(`${message.author.tag} has been verified!`);
            }
          })
          .catch(async () => {
            message.member.kick().catch((error) => {
              console.log(
                `There was an error in kicking ${message.author.tag}! \n ${error}`
              );
            });
            message.channel.bulkDelete(2);
            message.channel
              .createInvite({
                maxAge: 0,
                maxUses: 1,
              })
              .then(async (invite) => {
                let retryEmbed = new EmbedBuilder()
                  .setAuthor(
                    message.author.username,
                    message.author.avatarURL()
                  )
                  .setThumbnail(
                    message.guild.iconURL({
                      dynamic: true,
                    })
                  )
                  .setTitle("YOU HAVE FAILED THE VERIFICATION")
                  .setColor(colors.red)
                  .setDescription(
                    `You have failed the verification in \`${message.guild.name}\`! If you want to try again, please click [here](${invite}) to rejoin!`
                  )
                  .setFooter(
                    message.client.user.username,
                    message.client.user.avatarURL()
                  );
                await message.author.send(retryEmbed);
              });
          });
      });
  },
};
