const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder,
	PermissionFlagsBits
  } = require("discord.js");
const config = require("../../botconfig/config.js");
const ee = require("../../botconfig/embed.js");
const settings = require("../../botconfig/settings.js");

module.exports = {
	name: "kick", //the command name for the Slash Command
	slashName: "kick", //the command name for the Slash Command
  	category: "Moderation",
	aliases: [], //the command aliases [OPTIONAL]
	description: "Kicks a user from the server", //the command description for Slash Command Overview
	cooldown: 1,
	memberpermissions: [PermissionFlagsBits.SendMessages], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
	options: [
		  {"User": { name: "user", description: "The user to kick.", required: true }},
		 {"Strig": { name: "reason", description: "The reason for kick.", required: true }},
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
	usage: "",  //the Command usage [OPTIONAL]
  	minargs: 0, // minimum args for the message, 0 == none [OPTIONAL]
  	maxargs: 0, // maximum args for the message, 0 == none [OPTIONAL]
 	minplusargs: 0, // minimum args for the message, splitted with "++" , 0 == none [OPTIONAL]
  	maxplusargs: 0, // maximum args for the message, splitted with "++" , 0 == none [OPTIONAL]
  	argsmissing_message: "", //Message if the user has not enough args / not enough plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
  	argstoomany_message: "", //Message if the user has too many / not enough args / too many plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
   messageRun: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
     
      const member = message.mentions.members.first();
        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (!member) {
            return message.reply('You need to mention the member you want to kick');
        }

        if (!member.kickable) {
            return message.reply('I cannot kick this user! Do they have a higher role? Do I have kick permissions?');
        }

        await member.kick(reason)
            .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
        message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
    },
	
		slashRun: async (client, interaction) => {
			const member = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!member.kickable) {
            return interaction.reply({ content: 'I cannot kick this user! Do they have a higher role? Do I have kick permissions?', ephemeral: true });
        }

        await member.kick(reason)
            .catch(error => interaction.reply({ content: `Sorry ${interaction.user} I couldn't kick because of : ${error}`, ephemeral: true }));
        interaction.reply(`${member.user.tag} has been kicked by ${interaction.user.tag} because: ${reason}`);
    },
};

};


