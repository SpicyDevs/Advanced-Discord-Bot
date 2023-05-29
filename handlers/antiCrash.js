const { WebhookClient, EmbedBuilder } = require("discord.js");
const config = require("../botconfig/config.js");

const errorClient = new WebhookClient({
  id: process.env.ERROR_LOGS_WEBHOOK_ID,
  token: process.env.ERROR_LOGS_WEBHOOK_TOKEN,
});

const formatStackTrace = (error) => {
  const stack = error.stack
    .replace(/    at /g, "- ")
    .split("\n")
    .slice(0, 5) // Limiting the stack trace to 5 lines
    .join("\n");

  return `\`\`\`${stack}\`\`\``;
};

module.exports = (client) => {
  process.on("unhandledRejection", (reason, promise) => {
    console.log("[antiCrash] :: Unhandled Rejection/Catch");
    console.log(reason);

    const errorEmbed = new EmbedBuilder()
      .setColor("#FF0000")
      .setTitle("Unhandled Rejection")
      .setDescription(`**Unhandled Rejection at:**\n\`${promise}\`\n\n**Reason:**\n\`${reason}\``)
      .addFields({name: "Stack Trace", value: formatStackTrace(reason)});

    errorClient.send({ embeds: [errorEmbed] });
  });

  process.on("uncaughtException", (error, origin) => {
    console.log("[antiCrash] :: Uncaught Exception/Catch");
    console.log(error);

    const errorEmbed = new EmbedBuilder()
      .setColor("#FF0000")
      .setTitle("Uncaught Exception")
      .setDescription(`**Uncaught Exception at:**\n\`${origin}\`\n\n**Error:**\n\`${error}\``)
      .addFields({name: "Stack Trace", value: formatStackTrace(error)});

    errorClient.send({ embeds: [errorEmbed] });
  });

  process.on("uncaughtExceptionMonitor", (error, origin) => {
    console.log("[antiCrash] :: Uncaught Exception/Catch (MONITOR)");
    console.log(error);

    const errorEmbed = new EmbedBuilder()
      .setColor("#FF0000")
      .setTitle("Uncaught Exception Monitor")
      .setDescription(`**Uncaught Exception Monitor at:**\n\`${origin}\`\n\n**Error:**\n\`${error}\``)
      .addFields({name: "Stack Trace", value: formatStackTrace(error)});

    errorClient.send({ embeds: [errorEmbed] });
  });
};
