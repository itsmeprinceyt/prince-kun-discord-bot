import { Message, EmbedBuilder } from "discord.js";

export default {
    triggers: [".?help"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
                name: "Help",
                iconURL:
                    "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("Commands")
            .setDescription(
                `**🚀Message Commands!**\n` +
                `> **📌 .?youtube** - Shows YouTube Channel\n\n` +

                `**🚀Slash Commands!**\n` +
                `> **📌 /ping** - Replies with Pong ( only for admin )\n\n` +

                `Use these commands to get started!`
            )
            
            .setFooter({
                text: new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            });

        await message.reply({ embeds: [embed] });
    },
};
