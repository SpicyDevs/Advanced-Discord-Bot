//here the event starts
const config = require("../../botconfig/config.js")
const Discord = require("discord.js")
const exec = require('child_process').exec;
module.exports = client => {
  try{
    try{
      const stringlength = 69;
      console.log("\n")
      console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightGreen)
      console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1+stringlength-` ┃ `.length)+ "┃".bold.brightGreen)
      console.log(`     ┃ `.bold.brightGreen + `Discord Bot is online!`.bold.brightGreen + " ".repeat(-1+stringlength-` ┃ `.length-`Discord Bot is online!`.length)+ "┃".bold.brightGreen)
      console.log(`     ┃ `.bold.brightGreen + ` /--/ ${client.user.tag} /--/ `.bold.brightGreen+ " ".repeat(-1+stringlength-` ┃ `.length-` /--/ ${client.user.tag} /--/ `.length)+ "┃".bold.brightGreen)
      console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1+stringlength-` ┃ `.length)+ "┃".bold.brightGreen)
      console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightGreen)
      client.channels.cache.get(process.env.GITHUB_LOGS_CHANNEL_ID).send('**[AUTOMATIC]** \nBot has been Successfully **Deployed** and **Ready**')
    }catch{ /* */ }
        
    //loop through the status per each 10 minutes
    setInterval(()=>{
          try {
      client.user.setActivity(`/help | ${client.guilds.cache.size} Guilds | ${Math.ceil(client.users.cache.size/1000)}k Members`, {
        type: Discord.ActivityType.WATCHING,
      });
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
    }, 15 * 1000);
  
  } catch (e){
    console.log(String(e.stack).grey.italic.dim.bgRed)
  }
}
