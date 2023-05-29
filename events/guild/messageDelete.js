const config = require(`../../botconfig/config.js`);
const ee = require(`../../botconfig/embed.js`);
const settings = require(`../../botconfig/settings.js`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
const AfkEntry = require(`../../database/schemas/utility/afk.js`);
const Discord = require("discord.js");
const { discordTimestamp } = require("visa2discord");
module.exports = async (client, message) => {
  try {
      // Function to delete snipes older than 1 day
const deleteExpiredSnipes = () => {
  const now = Date.now();
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

  for (const [channelId, snipe] of client.snipes) {
    if (now - snipe.date > oneDayInMilliseconds) {
      client.snipes.delete(channelId);
    }
  }
};

// Set interval to run deleteExpiredSnipes every 6 hours
setInterval(deleteExpiredSnipes, 6 * 60 * 60 * 1000);


  // Add the snipe to the map
  client.snipes.set(message.channel.id, {
    content: message.content,
    author: message.author,
    image: message.attachments.first()
      ? message.attachments.first().proxyURL
      : null,
    date: message.createdTimestamp,
  });

  } catch (e) {
    console.log(String(e.stack).grey.bgRed);
  }
};
