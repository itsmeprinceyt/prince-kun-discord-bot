import { Message, EmbedBuilder } from "discord.js";
import { HelpDescription } from "../utility/help-commands";

export default {
    triggers: [".?help-force"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
                name: "Prince-Kun • Commands",
                iconURL:
                    "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("Here are all the available commands which you can use!")
            .setDescription(HelpDescription)
            .setImage(
                "https://media.discordapp.net/attachments/1336322293437038602/1336708310904340572/Help.png"
            )
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();
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
