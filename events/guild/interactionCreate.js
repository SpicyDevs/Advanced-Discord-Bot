//Import Modules
const config = require(`../../botconfig/config.js`);
const ee = require(`../../botconfig/embed.js`);
const settings = require(`../../botconfig/settings.js`);
const { onCoolDown, replacemsg } = require("../../handlers/functions");
const Discord = require("discord.js");
const selfRolePanelSchema = require("../../database/schemas/selfrole/panel.js");

module.exports = async (client, interaction) => {
  if (interaction.isAutocomplete()) {
    //DO STUFF HERE
  }
  if (interaction.isContextMenuCommand()) {
    //DO STUFF HERE
  }
  if (interaction.isButton()) {
    if (interaction.customId.startsWith("selfrole.")) {
      let data = await selfRolePanelSchema.find({
        guildId: interaction.member.guild.id,
      });
      if (data.length === 0) return;
      data = data.find((x) => x.messageId === interaction.message.id);
      if (!data) return;
      let roleNoGuild = data.roles.find(
        (x) => x.buttonId === interaction.customId
      );
      if (!roleNoGuild) return;
      let role = interaction.guild.roles.cache.get(roleNoGuild.roleId);
      let member = interaction.member.guild.members.cache.get(
        interaction.member.user.id
      );
      if (data.requiredRoles.length > 0) {
        let hasRole = false;
        for (let i = 0; i < data.requiredRoles.length; i++) {
          if (
            !interaction.member.roles.cache.has(data.requiredRoles[i].roleId)
          ) {
            hasRole = true;
            break;
          }
        }
        if (hasRole)
          return interaction.reply({
            content: `You don't have the required roles to use this panel!`,
            ephemeral: true,
          });
      }
      if (data?.roleLimit > 0) {
        let userRoles = interaction.member.roles.cache.filter((x) =>
          data.roles.some((y) => y.roleId === x.id)
        );
        if (
          userRoles.size >= data.roleLimit &&
          !member.roles.cache.has(role.id)
        )
          return interaction.reply({
            content: `You already have the maximum amount of roles you can get from this panel, remove some roles!`,
            ephemeral: true,
          });
      }

      if (member.roles.cache.has(role.id)) {
        member.roles.remove(role);
        interaction.reply({
          content: `Removed the role ${role} from you!`,
          ephemeral: true,
        });
      } else {
        member.roles.add(role);
        interaction.reply({
          content: `Added the role ${role} to you!`,
          ephemeral: true,
        });
      }
    }
  }
  // do autocomplete handling
  const CategoryName = interaction.commandName;
  let command = false;
  try {
    if (
      client.slashCommands.has(
        CategoryName + interaction.options.getSubcommand()
      )
    ) {
      command = client.slashCommands.get(
        CategoryName + interaction.options.getSubcommand()
      );
    }
  } catch {
    if (client.slashCommands.has("normal" + CategoryName)) {
      command = client.slashCommands.get("normal" + CategoryName);
    }
  }
  if (command) {
    if (onCoolDown(interaction, command)) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new Discord.EmbedBuilder()
            .setColor(ee.wrongcolor)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            .setTitle(
              replacemsg(settings.messages.cooldown, {
                prefix: client.config.prefix,
                command: command,
                timeLeft: onCoolDown(interaction, command),
              })
            ),
        ],
      });
    }
    //if Command has specific permission return error
    if (
      command.memberpermissions &&
      command.memberpermissions.length > 0 &&
      !interaction.member.permissions.has(command.memberpermissions)
    ) {
      return interaction.reply({
        ephemeral: true,
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
                  prefix: client.config.prefix,
                }
              )
            ),
        ],
      });
    }
    //if Command has specific needed roles return error
    if (
      command.requiredroles &&
      command.requiredroles.length > 0 &&
      interaction.member.roles.cache.size > 0 &&
      !interaction.member.roles.cache.some((r) =>
        command.requiredroles.includes(r.id)
      )
    ) {
      return interaction.reply({
        ephemeral: true,
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
                  prefix: client.config.prefix,
                }
              )
            ),
        ],
      });
    }
    //if Command has specific users return error
    if (
      command.alloweduserids &&
      command.alloweduserids.length > 0 &&
      !command.alloweduserids.includes(interaction.member.id)
    ) {
      return message.channel.send({
        ephemeral: true,
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
                  prefix: client.config.prefix,
                }
              )
            ),
        ],
      });
    }
    //execute the Command
    command.slashRun(client, interaction);
  }
};
