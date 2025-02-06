import { Message, EmbedBuilder } from "discord.js";
import { HelpDescriptionAdmin } from "../utility/help-command-admin";

export default {
    triggers: [".?help-admin",".?admin"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
                name: "Prince-Kun • Commands",
                iconURL:
                    "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("All Admin Commands !")
            .setDescription(HelpDescriptionAdmin)
            .setImage(
                "https://media.discordapp.net/attachments/1336322293437038602/1336708310904340572/Help.png"
            )
            .setFooter({
                text: `${message.author.username} | ${new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
                iconURL: message.author.displayAvatarURL(),
            });
        if (!message.guild) {
            await message.reply({ embeds: [embed] });
            return;
        }
        if (message.author.id !== message.guild.ownerId) {
            await message
                .reply("⛔ You must be the server owner to use this command!")
                .then((msg) => {
                    setTimeout(() => msg.delete().catch(() => { }), 5000);
                });
            return;
        }
        await message.reply({ embeds: [embed] });
    },
};
