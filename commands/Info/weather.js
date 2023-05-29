const { EmbedBuilder } = require("discord.js");
const { default: fetch } = require("node-fetch");
const config = require("../../botconfig/embed.js");

module.exports = {
  name: "weather", //the command name for the Slash Command
  slashName: "weather", //the command name for the Slash Command
  category: "Info",
  description: "Shows you the weather.", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    options: [
        {"String": { name: "city", description: "Weather of this city", required: true }}, //to use in the code: interacton.getString("ping_amount")
    ],
  slashRun: async (client, interaction) => {
    try {
      await interaction.deferReply({ ephemeral: false });
    //   const city = interaction.options.getString("city");
    //   console.log(city)

      const fetched = await fetch(`https://iamghosty.me/weather?city=${interaction.options.getString("city")}`,{
        method: 'GET',
        headers: {
          "x-api-key": "novabot"
        }
      });
    const data = await fetched.json();
    if(data.data == 'Please provide a valid city name') {return interaction.editReply({ content: `**Provide a correct city name.**` })}
    else{
    const embed = new EmbedBuilder()
        .setTitle(`Weather`)
        .setImage(`https:${data.data.image}`)
        .setDescription(`**${data.data.location}, ${data.data.country}**`)
        .addFields({
            name: "Temperature",
            value:  `\`\`\`js\n${data.data.temperature_c}°C or ${data.data.temperature_f}°F\`\`\``,
            inline: true
        },
        {
            name: "Feels Like",
            value:  `\`\`\`js\n${data.data.feelslike_c}°C or ${data.data.feelslike_f}°F\`\`\``,
            inline: true
        },
        {
            name: "Humidity",
            value:  `\`\`\`js\n${data.data.humidity}\`\`\``,
            inline: true
        },
        {
            name: "Wind Speed",
            value:  `\`\`\`js\n${data.data.wind_kmph}KmpH or ${data.data.wind_mph}mph\`\`\``,
        },
        {
            name: "Wind Direction",
            value:  `\`\`\`js\n${data.data.wind_degree}°\`\`\``,
            inline: true
        },
        {
            name: "Pressure",
            value:  `\`\`\`js\n${data.data.pressure_mb}mb or ${data.data.pressure_in}in\`\`\``,
            inline: true
        },
        {
            name: "Precipitation",
            value:  `\`\`\`js\n${data.data.precip_mm}mm or ${data.data.precip_in}in\`\`\``,
        })
        .setColor("#2F3136")
      await interaction.editReply({ embeds: [embed] });
    }
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

    const fetched = await fetch(`https://iamghosty.me/weather?city=${args.join(" ")}`,{
        method: 'GET',
        headers: {
          "x-api-key": "novabot"
        }
      });
    const data = await fetched.json();
    console.log(data)
     if(data.data == 'Please provide a valid city name') {return message.reply({ content: `**Provide a correct city name.**` })}
    else{
    const embed = new EmbedBuilder()
        .setTitle(`Weather`)
        .setImage(`https:${data.data.image}`)
        .setDescription(`**${data.data.location}, ${data.data.country}**`)
        .addFields({
            name: "Temperature",
            value:  `\`\`\`js\n${data.data.temperature_c}°C or ${data.data.temperature_f}°F\`\`\``,
            inline: true
        },
        {
            name: "Feels Like",
            value:  `\`\`\`js\n${data.data.feelslike_c}°C or ${data.data.feelslike_f}°F\`\`\``,
            inline: true
        },
        {
            name: "Humidity",
            value:  `\`\`\`js\n${data.data.humidity}\`\`\``,
            inline: true
        },
        {
            name: "Wind Speed",
            value:  `\`\`\`js\n${data.data.wind_kmph}KmpH or ${data.data.wind_mph}mph\`\`\``,
        },
        {
            name: "Wind Direction",
            value:  `\`\`\`js\n${data.data.wind_degree}°\`\`\``,
            inline: true
        },
        {
            name: "Pressure",
            value:  `\`\`\`js\n${data.data.pressure_mb}mb or ${data.data.pressure_in}in\`\`\``,
            inline: true
        },
        {
            name: "Precipitation",
            value:  `\`\`\`js\n${data.data.precip_mm}mm or ${data.data.precip_in}in\`\`\``,
        })
        .setColor("#2F3136")
    message.channel.send({ embeds: [embed] });
      }
  },
};
