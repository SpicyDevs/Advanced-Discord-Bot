const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder,
    PermissionFlagsBits,
    formatEmoji
  } = require("discord.js");
  const config = require("../../botconfig/config.js");
  const ee = require("../../botconfig/embed.js");
  const settings = require("../../botconfig/settings.js");
  const ticketPanelSchema = require("../../database/schemas/setups/ticketsPanel.js");
  
  module.exports = {
    name: "ticket setup",
    slashName: "setup",
    category: "Tickets",
    aliases: ["tsetup", "tickets setup", "setup ticket", "setup tickets"],
    description: "Setup ticket panel in your server!",
    cooldown: 1,
    memberpermissions: [PermissionFlagsBits.SendMessages],
    requiredroles: [],
    alloweduserids: [],
    options: [],
    usage: "",
    minargs: 0,
    maxargs: 0,
    minplusargs: 0,
    maxplusargs: 0,
    argsmissing_message: "",
    argstoomany_message: "",
    slashRun: async (client, interaction) => {
      try {
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
          createdTimestamp
        } = interaction;
        const { guild } = member;
      } catch (e) {
        console.log(String(e.stack).bgRed);
      }
    },
    messageRun: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
      try {
        let data = await ticketPanelSchema.find({
          guildId: message.guild.id
        });
  
        if (data.length === 0) {
          data = new ticketPanelSchema({
            panelId: 1,
            guildId: message.guild.id,
            everyoneRoleId: message.guild.id
          });
  
          const main_ank = await message.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Ticket Setup")
                .setDescription(
                  "Select the options below to setup the ticket panel!"
                )
                .setColor(ee.color)
                .addFields(
                  {
                    name: "Panel Details",
                    value: `Panel ID: ${data.panelId}\nRemarks: ${
                      data.remarks || "None"
                    }`,
                    inline: true
                  },
                  {
                    name: `Members Role`,
                    value: `${
                      data.everyoneRoleId === message.guild.id
                        ? "@everyone"
                        : `<@&${data.everyoneRoleId}>`
                    }`,
                    inline: true
                  },
                  {
                    name: "Transcripts",
                    value: `${
                      data.Transcripts.enabled
                        ? formatEmoji(client.allEmojis.nova_turn_on, true)
                        : formatEmoji(client.allEmojis.nova_turn_off, true)
                    }`,
                    inline: true
                  },
                  {
                    name: "Multiple Tickets",
                    value: `${
                      data.Multipletickets
                        ? formatEmoji(client.allEmojis.nova_turn_on, true)
                        : formatEmoji(client.allEmojis.nova_turn_off, true)
                    }`,
                    inline: true
                  },
                  {
                    name: "Support Roles",
                    value: `${
                      data.supportRoles.length === 0
                        ? "None"
                        : data.supportRoles.map(
                            r => `<@&${r.roleId}>`
                          ).join(", ")
                    }`,
                    inline: true
                  },
                  {
                    name: "Options",
                    value: `${
                      data.Options.length === 0
                        ? "None"
                        : data.Options.map(
                            o =>
                              `Name: ${o.name}\nDescription: ${o.description}\nEmoji: ${o.emoji}\nType: ${o.type}\nCategory: ${o.categoryId}`
                          ).join("\n\n")
                    }`,
                    inline: false
                  }
                )
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Secondary)
                  .setLabel("Edit Members Role")
                  .setCustomId("edit_members_role")
                  .setEmoji(client.allEmojis.dc_ping),
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Secondary)
                  .setLabel("Edit Transcripts")
                  .setCustomId("edit_transcripts")
                  .setEmoji(client.allEmojis.dc_channel),
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Primary)
                  .setLabel("Edit Multiple Tickets")
                  .setCustomId("edit_multiple_tickets")
                  .setEmoji(client.allEmojis.multi_tickets)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Primary)
                  .setLabel("Edit Support Roles")
                  .setCustomId("edit_support_roles")
                  .setEmoji(client.allEmojis.dc_server_admin),
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Primary)
                  .setLabel("Edit Options")
                  .setCustomId("edit_options")
                  .setEmoji(client.allEmojis.dc_server_owner),
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Secondary)
                  .setLabel("Edit Remarks")
                  .setCustomId("edit_remarks")
                  .setEmoji(client.allEmojis.dc_rules)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Success)
                  .setLabel("Publish Panel")
                  .setCustomId("publish_panel")
                  .setEmoji(client.allEmojis.dc_server_tag),
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Danger)
                  .setLabel("Cancel")
                  .setCustomId("cancel")
                  .setEmoji(client.allEmojis.nova_no)
              )
            ]
          });
  
          // Add event listener for button interactions
		  client.on("interactionCreate", async (interaction) => {
			if (!interaction.isButton()) return;
		  
			const customId = interaction.customId;
			const data = await ticketPanelSchema.findOne({ guildId: interaction.guild.id });
		  
			if (customId === "edit_members_role") {
			  // Handle edit roles button click
			  const filter = (m) => m.author.id === interaction.user.id;
			  const collector = interaction.channel.createMessageCollector({ filter, max: 1 });
		  
			  interaction.reply({
				content: "Please provide the role you want to set as the members role (ping the role or send the role ID).",
				ephemeral: true,
			  });
		  
			  collector.on("collect", async (msg) => {
				let roleId;
				const mentionedRoles = msg.mentions.roles;
				if (mentionedRoles.size > 0) {
				  roleId = mentionedRoles.first().id;
				} else {
				  roleId = msg.content;
				}
		  
				data.everyoneRoleId = roleId;
				await data.save();
		  
				const embed = interaction.message.embeds[0];
				const membersRoleField = embed.fields.find((field) => field.name === "Members Role");
				membersRoleField.value = roleId === interaction.guildId ? "@everyone" : `<@&${roleId}>`;
		  
				interaction.editReply({ embeds: [embed] });
			  });
			} else if (customId === "edit_transcripts") {
			  // Handle edit transcripts button click
			  data.Transcripts.enabled = !data.Transcripts.enabled;
			  await data.save();
		  
			  const embed = interaction.message.embeds[0];
			  const transcriptsField = embed.fields.find((field) => field.name === "Transcripts");
			  transcriptsField.value = data.Transcripts.enabled ? formatEmoji(client.allEmojis.nova_turn_on, true) : formatEmoji(client.allEmojis.nova_turn_off, true);
		  
			  interaction.editReply({ embeds: [embed] });
			} else if (customId === "edit_multiple_tickets") {
			  // Handle edit multiple tickets button click
			  data.Multipletickets = !data.Multipletickets;
			  await data.save();
		  
			  const embed = interaction.message.embeds[0];
			  const multipleTicketsField = embed.fields.find((field) => field.name === "Multiple Tickets");
			  multipleTicketsField.value = data.Multipletickets ? formatEmoji(client.allEmojis.nova_turn_on, true) : formatEmoji(client.allEmojis.nova_turn_off, true);
		  
			  interaction.editReply({ embeds: [embed] });
			}
		  });
		  
  
        }
      } catch (e) {
        console.log(String(e.stack).bgRed);
      }
    }
  };
  