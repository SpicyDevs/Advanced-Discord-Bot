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
    name: "purge",
    slashName: "purge",
    category: "Moderation",
    aliases: ["clear"],
    description: "Deletes number of messages specified by u.sssssss",
    cooldown: 1,
    memberpermissions: [PermissionFlagsBits.SendMessages],
    requiredroles: [],
    alloweduserids: [],
    options: [
        {
            "Integer": { name: "amount", description: "How many messages you want to purge?", required: true }
        }
    ],
    usage: "",
    minargs: 0,
    maxargs: 0,
    minplusargs: 0,
    maxplusargs: 0,
    argsmissing_message: "",
    argstoomany_message: "",
    slashRun: async (client, interaction) => {
        try {
            const { options } = interaction;
            const amount = options.getInteger("amount");

            if (!amount || amount < 1 || amount > 1000) {
                return interaction.reply({
                    content: "Please enter a valid number between 1 and 1000.",
                    ephemeral: true
                });
            }

            const channel = interaction.channel;
            let messagesToDelete = amount;

            while (messagesToDelete > 0) {
                const deleteAmount = Math.min(messagesToDelete, 200);
                const messages = await channel.messages.fetch({ limit: deleteAmount + 1 });
                await channel.bulkDelete(messages);
                messagesToDelete -= deleteAmount;
            }

            const reply = await interaction.channel.send({ content: `Successfully deleted **${amount}** messages.` });
            setTimeout(() => {
                reply.delete();
            }, 5000);

        } catch (e) {
            console.log(String(e.stack).bgRed);
        }
    },
    messageRun: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
        try {
            const amount = parseInt(args[0]);

            if (amount < 1 || !amount || amount > 1000) {
                return message.channel.send("Please enter a valid number **between** 1 and 1000.");
            }

            let messagesToDelete = amount;
            const channel = message.channel;

            while (messagesToDelete > 0) {
                const deleteAmount = Math.min(messagesToDelete, 200);
                await channel.bulkDelete(deleteAmount + 1);
                messagesToDelete -= deleteAmount;
            }

            const reply = await message.channel.send(`Successfully deleted **${amount}** messages.`);
            setTimeout(() => {
                reply.delete();
            }, 5000);

        } catch (e) {
            console.log(String(e.stack).bgRed);
        }
    }
};
