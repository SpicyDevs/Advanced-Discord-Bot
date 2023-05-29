const { EmbedBuilder } = require("discord.js");
const {Snake}= require("discord-gamecord")

module.exports = {
  name: "snake", //the command name for the Slash Command
  slashName: "snake", //the command name for the Slash Command
  category: "Games",
  description: "Play the good OL snake games", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  slashRun: async (client, interaction) => {
    try {
      const snakeGame = new Snake({
        isSlashGame: true,
        message: interaction,
        embed: {
            title: 'Snake Game',
            overTitle: 'Game Over',
            color: "#2F3136"
          },
          emojis: {
            board: '⬛',
            food: '🍎',
            up: '⬆️', 
            down: '⬇️',
            left: '⬅️',
            right: '➡️',
          },
          stopButton: 'Stop',
          timeoutTime: 60000,
          snake: { head: '🟢', body: '🟩', tail: '🟢', over: '💀' },
          foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
          playerOnlyMessage: 'Only {player} can use these buttons.'
      })
      snakeGame.startGame();
      snakeGame.on('gameOver', result => {
        interaction.channel.send({
          content:`<@${interaction.user.id}> Check Out Your Score!`,
          embeds:[new EmbedBuilder().setDescription(`Your Score:${result.score}`).setColor("#2F3136")]});  // =>  { result... }
});

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
    const snakeGame = new Snake({
        isSlashGame: false,
        message: message,
        embed: {
            title: 'Snake Game',
            overTitle: 'Game Over',
            color: '#2F3136'
          },
          emojis: {
            board: '⬛',
            food: '🍎',
            up: '⬆️', 
            down: '⬇️',
            left: '⬅️',
            right: '➡️',
          },
          stopButton: 'Stop',
          timeoutTime: 60000,
          snake: { head: '🟢', body: '🟩', tail: '🟢', over: '💀' },
          foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
          playerOnlyMessage: 'Only {player} can use these buttons.'
      })
      snakeGame.startGame();
      snakeGame.on('gameOver', result => {
    message.channel.send({
      content: `<@${message.author.id}> Check Out Your Score!`,
      embeds:[new EmbedBuilder().setDescription(`Your Score:${result.score}`).setColor("#2F3136")]});  // =>  { result... }
})},
};
