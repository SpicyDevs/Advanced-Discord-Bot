const { Minesweeper  } = require('discord-gamecord');
const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: "minesweeper",
    slashName: "minesweeper",
    category: "Games",
    description: "Play the minesweeper game",
    cooldown: 1,
    memberpermissions: [],
    requiredroles: [],
    alloweduserids: [],
    slashRun: async(client, interaction) => {  
        try {
            const game = new Minesweeper({
                message: interaction,
                isSlashGame: true,
                embed: {
                    title: 'MineSweeper',
                    color: "#2F3136",
                    description: 'Click on the buttons to reveal the blocks except mines.'
                },
                emojis: { flag: '🚩', mine: '💣' },
                mines: 5,
                timeoutTime: 60000,
                winMessage: 'You won the Game! You successfully avoided all the mines.',
                loseMessage: 'You lost the Game! Beaware of the mines next time.',
                playerOnlyMessage: 'Only {player} can use these buttons.'
            })
            game.startGame();
            game.on('gameOver', result => {
                //console.log(result);
                interaction.channel.send({embeds:[new EmbedBuilder().setDescription(`Your Score:${result.score}`).setColor("#2F3136")]});  // =>  { result... }
            })
        } catch (error) {
            console.log(String(error.stack).bgRed)
            
        }
     },
        messageRun: async(client, message, args, plusArgs, cmdUser, text, prefix) => {
            try{
                const game = new Minesweeper({
                    message: message,
                    isSlashGame: false,
                    embed: {
                        title: 'MineSweeper',
                        color: "#2F3136",
                        description: 'Click on the buttons to reveal the blocks except mines.'
                    },
                    emojis: { flag: '🚩', mine: '💣' },
                    mines: 5,
                    timeoutTime: 60000,
                    winMessage: 'You won the Game! You successfully avoided all the mines.',
                    loseMessage: 'You lost the Game! Beaware of the mines next time.',
                    playerOnlyMessage: 'Only {player} can use these buttons.'
                })
            game.startGame();
            game.on('gameOver', result => {
                //console.log(result);
                message.channel.send({embeds:[new EmbedBuilder().setDescription(`Your turned ${result.blocksTurned} blocks` ).setColor("#2F3136")]});  // =>  { result... }
            })
        }catch (error) {
            console.log(String(error.stack).bgRed)
        }
        }

}