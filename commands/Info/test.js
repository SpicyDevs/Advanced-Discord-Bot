const { EmbedBuilder, ButtonBuilder, ButtonStyle,ActionRowBuilder } = require("discord.js");
const config = require("../../botconfig/config.js");
const ee = require("../../botconfig/embed.js");
const settings = require("../../botconfig/settings.js");
module.exports = {
    name: "test", //the command name for the Slash Command
    slashName: "test", //the command name for the Slash Command
    category: "Info",
    aliases: ["example"], //the command aliases [OPTIONAL]
    description: "test command", //the command description for Slash Command Overview
    cooldown: 1,
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
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
            const button1 = new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("\u200b")
                .setCustomId("test1")
                const button2 = new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setLabel("TestCommand")
                .setEmoji("<:hehe_boi:1109465424858456074>")
                .setCustomId("test2")
                const button3 = new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setLabel("TestCommand")
                .setEmoji("<:hehe_boi:1109465424858456074>")
                .setCustomId("test3")
                const row = new ActionRowBuilder()
                .addComponents(button1,button2,button3)
            const embeds = new EmbedBuilder()
                .setColor("Aqua")
                .setTitle("Test Command For NOVA")
                .setDescription("This is a test command for NOVA")
                
            await interaction.reply({ embeds: [embeds], components: [row], ephemeral: false });

            //let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices
            //const StringOption = options.getString("what_ping"); //same as in StringChoices
            //let UserOption = options.getUser("OPTIONNAME");
            //let ChannelOption = options.getChannel("OPTIONNAME");
            //let RoleOption = options.getRole("OPTIONNAME");
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
          const btn1 = new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setLabel("Red")
            .setCustomId("btn1");
          const btn2 = new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setLabel("Green")
            .setCustomId("btn2");
          const btn3 = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel("Blue")
            .setCustomId("btn3");
            const btn4 = new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Grey")
            .setCustomId("btn4");
      
          const button1 = new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setEmoji("1111989943384948869")
            .setCustomId("test4");
          const button2 = new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setLabel("Example Label")
            .setCustomId("test5");
          const button3 = new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setLabel("Example Label")
            .setEmoji("1111989943384948869")
            .setCustomId("test6");
      
          const row = new ActionRowBuilder()
            .addComponents(button1, button2, button3);
          const row1 = new ActionRowBuilder()
            .addComponents(btn1, btn2, btn3, btn4);
      
          const embeds = new EmbedBuilder()
            .setTitle("NOVA")
            .setDescription("Example embed message with buttons.")
            .setColor(0x2b2c30);
          await message.channel.send({ embeds: [embeds], components: [row] });
          await message.channel.send({ content: "Example plain message with buttons.", components: [row] });
          await message.channel.send({ content: "Example plain message with color buttons.", components: [row1] });
        } catch (e) {
          console.log(String(e.stack).bgRed);
        }      
    },
};
