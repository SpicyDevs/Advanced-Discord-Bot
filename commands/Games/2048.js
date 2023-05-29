const { TwoZeroFourEight } = require('discord-gamecord');
const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: "2048",
    slashName: "2048",
    category: "Games",
    description: "Play the 2048 game",
    cooldown: 1,
    memberpermissions: [],
    requiredroles: [],
    alloweduserids: [],
    slashRun: async(client, interaction) => {  
        try {
            const game = new TwoZeroFourEight({
                message: interaction,
                embed: {
                    title: '2048',
                    color: "#2F3136"
                },
                emojis: {
                    up: '⬆️',
                    down: '⬇️',
                    left: '⬅️',
                    right: '➡️',
                  },
                  timeoutTime: 60000,
                  buttonStyle: 'PRIMARY',
                  playerOnlyMessage: 'Only {player} can use these buttons.'
            })
            game.startGame();
            game.on('gameOver', result => {
                interaction.channel.send({embeds:[new EmbedBuilder().setDescription(`Your Score:${result.score}`).setColor("#2F3136")]});  // =>  { result... }
            })
        } catch (error) {
            console.log(String(error.stack).bgRed)
            
        }
     },
        messageRun: async(client, message, args, plusArgs, cmdUser, text, prefix) => {
            try{
            const game = new TwoZeroFourEight({
                message: message,
                embed: {
                    title: '2048',
                    color: "#2F3136"
                },
                emojis: {
                    up: '⬆️',
                    down: '⬇️',
                    left: '⬅️',
                    right: '➡️',
                  },
                  timeoutTime: 60000,
                  buttonStyle: 'PRIMARY',
                  playerOnlyMessage: 'Only {player} can use these buttons.'
            })
            game.startGame();
            game.on('gameOver', result => {
                //console.log(result);
                message.channel.send({embeds:[new EmbedBuilder().setDescription(`Your Score:${result.score}`).setColor("#2F3136")]});  // =>  { result... }
            })
        }catch (error) {
            console.log(String(error.stack).bgRed)
        }
        }

}