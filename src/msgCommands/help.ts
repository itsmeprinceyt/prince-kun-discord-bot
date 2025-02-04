import { Message, EmbedBuilder } from "discord.js";

export default {
    triggers: [".?help"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
                name: "Prince-Kun Commands",
                iconURL:
                    "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("All available commands!")
            .setDescription(
                `**🚀 Message Commands!**\n` +
                `> **📌 .?youtube** - Shows YouTube Channel\n\n` +

                `**🚀 Slash Commands!**\n` +
                `> **📌 /ping** - Replies with Pong ( only for admin )\n\n` +

                `Use these commands to get started!`
            )
            .setFooter({
                text: new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            });

        try {
            // Send the embed to the user's DMs
            await message.author.send({ embeds: [embed] });

            // If the command was used in a server, reply in the channel
            if (message.guild) {
                await message.reply({
                    content: "📩 I've sent you a DM with all the available commands!",
                });
            }
        } catch (error) {
            console.error("Failed to send DM:", error);
            if (message.guild) {
                await message.reply({
                    content: "⚠️ I couldn't send you a DM! Please check your privacy settings.",
                });
            }
        }
    },
};
