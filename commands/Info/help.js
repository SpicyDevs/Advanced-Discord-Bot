const {
  EmbedBuilder,
  codeBlock,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  formatEmoji
} = require("discord.js");
const config = require("../../botconfig/config.js");
const ee = require("../../botconfig/embed.js");
const settings = require("../../botconfig/settings.js");
const stringSimilarity = require("string-similarity");

module.exports = {
  name: "help", //the command name for execution & for helpcmd
  slashName: "help", //the command name for slash command
  category: "Info",
  aliases: ["h", "commandinfo", "cmds", "cmd", "halp"], //the command aliases [OPTIONAL]
  cooldown: 3, //the command cooldown for execution & for helpcmd [OPTIONAL]
  usage: "help [Commandname]", //the command usage [OPTIONAL]
  description: "Returns all Commmands, or one specific command", //the command description for helpcmd [OPTIONAL]
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [
    //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
    //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ]
    //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
    {
      String: {
        name: "specific_cmd",
        description: "Want details of a Specific Command?",
        required: false,
      },
    }, //to use in the code: interacton.getString("ping_amount")
    //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
    //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
    //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
    //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    //{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: false, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  minargs: 0, // minimum args for the message, 0 == none [OPTIONAL]
  maxargs: 0, // maximum args for the message, 0 == none [OPTIONAL]
  minplusargs: 0, // minimum args for the message, splitted with "++" , 0 == none [OPTIONAL]
  maxplusargs: 0, // maximum args for the message, splitted with "++" , 0 == none [OPTIONAL]
  argsmissing_message: "", //Message if the user has not enough args / not enough plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
  argstoomany_message: "", //Message if the user has too many / not enough args / too many plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
  slashRun: async (client, interaction) => {
    try {
      const { member, options } = interaction;

      const { guild } = member;
      const prefix = client.config.prefix;
      const args = options.getString("specific_cmd");

      if (args && args.length > 0) {
        const commandName = args.toLowerCase();
        const cmd =
          client.commands.get(commandName) ||
          client.commands.get(client.aliases.get(commandName));

        if (!cmd) {
          const allCommands = client.commands.map((cmd) => cmd.name);
          const matches = stringSimilarity.findBestMatch(
            commandName,
            allCommands
          );
          const suggestions = matches.ratings
            .map((rating, index) => ({
              command: allCommands[index],
              rating: rating.rating,
            }))
            .filter((suggestion) => suggestion.rating > 0);

          const suggestionList = suggestions
            .map(
              (suggestion, index) => `\`[${index + 1}]\` ${suggestion.command}`
            )
            .join("\n");

          const errorMessage = `No information found for command **${commandName}**\nDo you mean this?\n ${suggestionList}`;

          return interaction.reply({
            ephemeral: true,
            embeds: [
              new EmbedBuilder()
                .setColor(ee.wrongcolor)
                .setDescription(errorMessage),
            ],
          });
        }

        const embed = new EmbedBuilder()
          .setColor(ee.color)
          .setTitle(`Detailed Information about: \`${cmd.name}\``);

        if (cmd.aliases)
          embed.addFields({
            name: "**Aliases**",
            value: cmd.aliases.map((alias) => `\`${alias}\``).join(", "),
          });

        embed.addFields({
          name: "**Cooldown**",
          value: cmd.cooldown
            ? `\`${cmd.cooldown} Seconds\``
            : `\`${settings.default_cooldown_in_sec} Second\``,
        });

        if (cmd.usage)
          embed.addFields({
            name: "**Usage**",
            value: `\`${prefix}${cmd.usage}\``,
          });

        embed.setDescription(`${codeBlock(
          "diff",
          `- [] = optional argument
- <> = required argument
- Do NOT type these when using commands!`
        )}
    > ${cmd.description}`);

        return interaction.reply({
          ephemeral: true,
          embeds: [embed],
        });
      } else {
        const commandsByCategory = (category) => {
          return client.slashCommands
            .filter((cmd) => cmd.category === category)
            .map((cmd) => `\`${cmd.name}\``);
        };

        const embed = new EmbedBuilder()
          .setColor(ee.color)
          .setThumbnail(client.user.displayAvatarURL())
          .setDescription(
            `- Prefix for this server is \`${prefix}\`
        - Total commands: \`${client.commands.size}\`
        - [Get ${client.config.botName}](${client.config.invite_url}) | [Support server](${client.config.support_server.invite}) | [Vote me](https://top.gg/bot/${client.user.id}/vote)
        - Type \`${prefix}help <command | module>\` for more info.`
          )
          .setFooter({
            text: `To see command Descriptions and Information, type: ${prefix}help [CMD NAME]`,
            iconURL: client.user.displayAvatarURL(),
          });
        const options = client.categories
          .filter((category) => {
            if (category === "Owner") {
              return settings.ownerIDS.includes(message.author.id);
            }
            return true;
          })
          .map((category) => {
            const emoji = client.emojis.cache.find(
              (emoji) => emoji.id === client.allEmojis[category]
            );
            return {
              label: category,
              value: category.toLowerCase(),
              description: `Commands Count: ${commandsByCategory(category).length}`,
              emoji: {
                name: emoji ? emoji.name : "",
                id: emoji ? emoji.id : "",
                animated: emoji ? emoji.animated : false,
              },
            };
          });
        
        const msg = await interaction.reply({
          ephemeral: true,
          embeds: [embed],
          components: [
            new ActionRowBuilder().addComponents(
              new StringSelectMenuBuilder()
                .setCustomId("help_menu_select")
                .setPlaceholder("Select a Category")
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(options)
            ),
          ],
        });
        
        const filterMenu = (interaction) =>
          interaction.customId === "help_menu_select";
        let collector;
        
        try {
          collector = msg.createMessageComponentCollector({
            filter: filterMenu,
            time: 30_000,
          });
        } catch (error) {
          return interaction.editReply({
            components: [
              new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                  .setCustomId("help_menu_select")
                  .setPlaceholder("Select a Category")
                  .setMinValues(1)
                  .setMaxValues(1)
                  .addOptions(options)
                  .setDisabled(true)
              ),
            ],
          });
        }
        
        collector.on("collect", async (response) => {
          if (response.customId === "help_menu_select") {
            const selectedCategory = response.values[0];
            const categoryCommands = commandsByCategory(
              capitalizeFirstLetter(selectedCategory)
            );
            const categoryEmbed = new EmbedBuilder().setDescription(
              `**__${capitalizeFirstLetter(
                selectedCategory.toUpperCase()
              )}__ [${categoryCommands.length}]**\n \n - ${categoryCommands.join(", ")}`
            );
        
            interaction.editReply({
              embeds: [categoryEmbed],
            });
        
            response.deferUpdate();
          }
        });
        
        collector.on("end", async (response) => {
          return interaction.editReply({
            components: [
              new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                  .setCustomId("help_menu_select")
                  .setPlaceholder("Select a Category")
                  .setMinValues(1)
                  .setMaxValues(1)
                  .addOptions(options)
                  .setDisabled(true)
              ),
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("previous_page")
                  .setLabel("Previous")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("next_page")
                  .setLabel("Next")
                  .setStyle(ButtonStyle.Primary)
              ),
            ],
          });
        });
        
        // Add button event listener
        client.on("interactionCreate", async (interaction) => {
          if (interaction.isButton()) {
            const { customId } = interaction;
            const [currentPage, totalPages] = interaction.message.embeds[0].footer.text
              .split(" | ")[1]
              .match(/\d+/g);
            
            if (customId === "previous_page") {
              // Handle previous page button click
              const previousPageEmbed = createPageEmbed(currentPage - 1, totalPages);
              interaction.message.edit({ embeds: [previousPageEmbed] });
            } else if (customId === "next_page") {
              // Handle next page button click
              const nextPageEmbed = createPageEmbed(currentPage + 1, totalPages);
              interaction.message.edit({ embeds: [nextPageEmbed] });
            }
          }
        });
        
        // Function to create page-specific embeds
        function createPageEmbed(currentPage, totalPages) {
          // Implement logic to fetch and display commands based on the current page
          // You can use the `currentPage` and `totalPages` variables to determine the offset and limit for displaying commands
          
          const pageEmbed = new EmbedBuilder()
            .setColor(ee.color)
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(
              `- Prefix for this server is \`${prefix}\`
        - Total commands: \`${client.commands.size}\`
        - [Get ${client.config.botName}](${client.config.invite_url}) | [Support server](${client.config.support_server.invite}) | [Vote me](https://top.gg/bot/${client.user.id}/vote)
        - Type \`${prefix}help <command | module>\` for more info.`
            )
            .setFooter({
              text: `To see command Descriptions and Information, type: ${prefix}help [CMD NAME] | Page ${currentPage} / ${totalPages}`,
              iconURL: client.user.displayAvatarURL(),
            });
            
          return pageEmbed;
        }
      }        
    } catch (error) {
      console.log(String(error.stack).bgRed);
      return interaction.followUp({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(ee.wrongcolor)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            .setTitle(`${formatEmoji(client.allEmojis.x)} ERROR | An error occurred`)
            .setDescription(
              `\`\`\`${String(error.message || error).substr(0, 2000)}\`\`\``
            ),
        ],
      });
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
      const prefix = client.config.prefix;
      const cmds = args.join(" ");
      if (cmds && cmds.length > 0) {
        const commandName = cmds.toLowerCase();
        const cmd =
          client.commands.get(commandName) ||
          client.commands.get(client.aliases.get(commandName));

        if (!cmd) {
          const allCommands = client.commands.map((cmd) => cmd.name);
          const matches = stringSimilarity.findBestMatch(
            commandName,
            allCommands
          );
          const suggestions = matches.ratings
            .map((rating, index) => ({
              command: allCommands[index],
              rating: rating.rating,
            }))
            .filter((suggestion) => suggestion.rating > 0);

          const suggestionList = suggestions
            .map(
              (suggestion, index) => `\`[${index + 1}]\` ${suggestion.command}`
            )
            .join("\n");

          const errorMessage = `No information found for command **${commandName}**\nDo you mean this?\n ${suggestionList}`;

          return message.reply({
            ephemeral: true,
            embeds: [
              new EmbedBuilder()
                .setColor(ee.wrongcolor)
                .setDescription(errorMessage),
            ],
          });
        }

        const embed = new EmbedBuilder()
          .setColor(ee.color)
          .setTitle(`Detailed Information about: \`${cmd.name}\``);

        if (cmd.aliases)
          embed.addFields({
            name: "**Aliases**",
            value: cmd.aliases.map((alias) => `\`${alias}\``).join(", "),
          });

        embed.addFields({
          name: "**Cooldown**",
          value: cmd.cooldown
            ? `\`${cmd.cooldown} Seconds\``
            : `\`${settings.default_cooldown_in_sec} Second\``,
        });

        if (cmd.usage)
          embed.addFields({
            name: "**Usage**",
            value: `\`${prefix}${cmd.usage}\``,
          });

        embed.setDescription(`${codeBlock(
          "diff",
          `- [] = optional argument
- <> = required argument
- Do NOT type these when using commands!`
        )}
    > ${cmd.description}`);

        return message.reply({
          ephemeral: true,
          embeds: [embed],
        });
      } else {
        const commandsByCategory = (category) => {
          return client.slashCommands
            .filter((cmd) => cmd.category === category)
            .map((cmd) => `\`${cmd.name}\``);
        };

        const embed = new EmbedBuilder()
          .setColor(ee.color)
          .setThumbnail(client.user.displayAvatarURL())
          .setDescription(
            `- Prefix for this server is \`${prefix}\`
- Total commands: \`${client.commands.size}\`
- [Get ${client.config.botName}](${client.config.invite_url}) | [Support server](${client.config.support_server.invite}) | [Vote me](https://top.gg/bot/${client.user.id}/vote)
- Type \`${prefix}help <command | module>\` for more info.`
          )
          .setFooter({
            text: `To see command Descriptions and Information, type: ${prefix}help [CMD NAME]`,
            iconURL: client.user.displayAvatarURL(),
          });

        const options = client.categories
          .filter((category) => {
            if (category === "Owner") {
              return settings.ownerIDS.includes(message.author.id);
            }
            return true;
          })
          .map((category) => {
            const emoji = client.emojis.cache.find(
              (emoji) => emoji.id === client.allEmojis[category]
            );
            return {
              label: category,
              value: category.toLowerCase(),
              description: `Commands count: ${commandsByCategory(category).length
                }`,
              emoji: {
                name: emoji ? emoji.name : "",
                id: emoji ? emoji.id : "",
                animated: emoji ? emoji.animated : false,
              },
            };
          });

        const msg = await message.reply({
          ephemeral: true,
          embeds: [embed],
          components: [
            new ActionRowBuilder().addComponents(
              new StringSelectMenuBuilder()
                .setCustomId("help_menu_select")
                .setPlaceholder("Select a Category")
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(options)
            ),
          ],
        });
        const filterMenu = (response) =>
          response.customId === "help_menu_select";
        let collector;

        try {
          collector = msg.createMessageComponentCollector({
            filter: filterMenu,
            time: 30_000,
          });
        } catch (error) {
          return msg.edit({
            components: [
              new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                  .setCustomId("help_menu_select")
                  .setPlaceholder("Select a Category")
                  .setMinValues(1)
                  .setMaxValues(1)
                  .addOptions(options)
                  .setDisabled(true)
              ),
            ],
          });
        }

        collector.on("collect", async (response) => {
          if (response.customId === "help_menu_select") {
            const selectedCategory = response.values[0];
            const categoryCommands = commandsByCategory(
              capitalizeFirstLetter(selectedCategory)
            );
            const categoryEmbed = new EmbedBuilder().setDescription(
              `**__${capitalizeFirstLetter(
                selectedCategory.toUpperCase()
              )}__ [${categoryCommands.length
              }]**\n \n - ${categoryCommands.join(", ")}`
            );

            msg.edit({
              embeds: [categoryEmbed],
            });

            response.deferUpdate();
          }
        });

        collector.on("end", async (response) => {
          return msg.edit({
            components: [
              new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                  .setCustomId("help_menu_select")
                  .setPlaceholder("Select a Category")
                  .setMinValues(1)
                  .setMaxValues(1)
                  .addOptions(options)
                  .setDisabled(true)
              ),
            ],
          });
        });
      }
    } catch (error) {
      console.log(String(error.stack).bgRed);
      return message.channel.send({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(ee.wrongcolor)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            .setTitle(`${formatEmoji(client.allEmojis.x)} ERROR | An error occurred`)
            .setDescription(
              `\`\`\`${String(error.message || error).substr(0, 2000)}\`\`\``
            ),
        ],
      });
    }
  },
};

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
