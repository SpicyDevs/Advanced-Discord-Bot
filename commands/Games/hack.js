const { EmbedBuilder } = require("discord.js");
const { default: fetch } = require("node-fetch");
const config = require("../../botconfig/embed.js");

module.exports = {
  name: "hack", //the command name for the Slash Command
  slashName: "hack", //the command name for the Slash Command
  category: "Games",
  description: "Hack Someone", //the command description for Slash Command Overview
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
    try {
      function wait(ms) {
        let start = new Date().getTime();
        let end = start;
        while (end < start + ms) {
          end = new Date().getTime();
        }
      }

      const taggedUser = message.mentions.users.first();
      if (!taggedUser) {
        return message.channel.send("Please mention the target!");
      }
      if (taggedUser.bot) {
        return message.channel.send(
          "People live and learn... but you just live"
        );
      }
      message.channel.send(`Hacking  ${taggedUser}...`);
      message.channel.send("Status: 0%").then((msg) => {
        wait(93);
        msg.edit(`\`\`\`js\nStatus: 7%\`\`\``);
        wait(100);
        msg.edit(`\`\`\`js\nStatus: 8%\`\`\``);
        wait(20);
        msg.edit(`\`\`\`js\nStatus: 9%\`\`\``);
        wait(90);
        msg.edit(`\`\`\`js\nStatus: 12%\`\`\``);
        wait(60);
        msg.edit(`\`\`\`js\nStatus: 14%\`\`\``);
        wait(60);
        msg.edit(`\`\`\`js\nStatus: 17%\`\`\``);
        wait(40);
        msg.edit(`\`\`\`js\nStatus: 20%\`\`\``);
        wait(10);
        msg.edit(`\`\`\`js\nStatus: 21%\`\`\``);
        wait(12);
        msg.edit(`\`\`\`js\nStatus: 22%\`\`\``);
        wait(13);
        msg.edit(`\`\`\`js\nStatus: 24%\`\`\``);
        wait(80);
        msg.edit(`\`\`\`js\nStatus: 29%\`\`\``);
        wait(80);
        msg.edit(`\`\`\`js\nStatus: 31%\`\`\``);
        wait(80);
        msg.edit(`\`\`\`js\nStatus: 36%\`\`\``);
        wait(40);
        msg.edit(`\`\`\`js\nStatus: 41%\`\`\``);
        wait(60);
        msg.edit(`\`\`\`js\nStatus: 47%\`\`\``);
        wait(50);
        msg.edit(`\`\`\`js\nStatus: 53%\`\`\``);
        wait(35);
        msg.edit(`\`\`\`js\nStatus: 58%\`\`\``);
        wait(80);
        msg.edit(`\`\`\`js\nStatus: 66%\`\`\``);
        wait(60);
        msg.edit(`\`\`\`js\nStatus: 74%\`\`\``);
        wait(20);
        msg.edit(`\`\`\`js\nStatus: 79%\`\`\``);
        wait(83);
        msg.edit(`\`\`\`js\nStatus: 80%\`\`\``);
        wait(50);
        msg.edit(`\`\`\`js\nStatus: 85%\`\`\``);
        wait(14);
        msg.edit(`\`\`\`js\nStatus: 93%\`\`\``);
        wait(70);
        msg.edit(`\`\`\`js\nStatus: 97%\`\`\``);
        wait(90);
        msg.edit(`\`\`\`js\nStatus: 100%\`\`\``).then(() => {
          message.channel.send(
            `Succesfuly hacked ${taggedUser}.\n**I just sent you a text file to your DM with his IP and the password to remotly control his computer**`
          );
        });
      });
    } catch (error) {
      console.log(String(error.stack).bgRed);
    }
  },
};
