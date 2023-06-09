const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder,
  } = require("discord.js");
const config = require("../../botconfig/config.js");
const ee = require("../../botconfig/embed.js");
const settings = require("../../botconfig/settings.js");
const exec = require('child_process').exec;
module.exports = {
	name: "stash", //the command name for the Slash Command
	slashName: "stash", //the command name for the Slash Command
  	category: "Owner",
	aliases: [], //the command aliases [OPTIONAL]
	description: "Merge conflicting updates", //the command description for Slash Command Overview
	cooldown: 1,
	memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: settings.ownerIDS, //Only allow specific Users to execute a Command [OPTIONAL]
	options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
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
	usage: "",  //the Command usage [OPTIONAL]
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
				createdTimestamp
			} = interaction;
			const {
				guild
			} = member;
			//let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices
			//const StringOption = options.getString("what_ping"); //same as in StringChoices
			//let UserOption = options.getUser("OPTIONNAME");
			//let ChannelOption = options.getChannel("OPTIONNAME");
			//let RoleOption = options.getRole("OPTIONNAME");
			exec(`git pull`, (error, stdout) => {
                let response = (error || stdout);
                if (!error) {
                    if (response.includes("No local changes to save")) {
                        interaction.reply('There are no local chanes on the bot to save.')
                    } else {
                        interaction.reply(`Pulled latest commit from github, you can now update the bot. \n\nLogs: \n\`\`\`${response}\`\`\``)
                    };
                } else {
					interaction.reply('Error while pulling from GitHub. \n\nLogs: \n```' + response + "```")
				}
            });
		} catch (e) {
			console.log(String(e.stack).bgRed)
		}
	},
    messageRun: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
        try {
            exec(`git stash`, (error, stdout) => {
                let response = (error || stdout);
                if (!error) {
                    if (response.includes("No local changes to save")) {
                        message.channel.send('There are no local chanes on the bot to save.')
                    } else {
                        message.channel.send(`Pulled latest commit from github, you can now update the bot. \n\nLogs: \n\`\`\`${response}\`\`\``)
                    };
                } else {
					message.channel.send('Error while pulling from GitHub. \n\nLogs: \n```' + response + "```")
				}
            });
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}

