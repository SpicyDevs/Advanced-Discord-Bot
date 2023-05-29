const { EmbedBuilder } = require("discord.js");
const { default: fetch } = require("node-fetch");
const {FastType} = require("discord-gamecord")


module.exports = {
  name: "typerace", //the command name for the Slash Command
  slashName: "typerace", //the command name for the Slash Command
  category: "Games",
  description: "Lets see how fsr you type", //the command description for Slash Command Overview
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
    const data = await fetch(`https://iamghosty.me/randomsentence`)
    const sentence = await data.json()
    // console.log(sentence.sentence)
    const game = new FastType({
        embed: {
            title: 'Fast Type',
            color: '#2F3136',
            description: 'You have {time} seconds to type the sentence below.'
          },
        message: message,
        winMessage: "GG you won!", //message sent when user types perfectly
        sentence: sentence.sentence, //sentence-to-be-typed
        time: 50000, //time that user has in ms
        startMessage: "Good Luck!", //message sent when user starts playing
    })
    game.startGame()
    game.on('gameOver', result => {
        //console.log(result.)
        message.channel.send({embeds:[new EmbedBuilder().setDescription(`**Your Typing Speed:${result.FasttypeGame.wpm}**\n**Time Taken:${result.FasttypeGame.timeTaken}s**`).setColor("#2F3136")]});  // =>  { result... }
      });

  },
};
