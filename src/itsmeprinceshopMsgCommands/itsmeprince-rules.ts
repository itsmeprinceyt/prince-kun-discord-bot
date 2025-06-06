import { Message, EmbedBuilder } from "discord.js";
import { ItsMePrinceRules } from "../utility/itsmeprince-rules";

export default {
    triggers: [".?shoprules", ".?rulesshop", ".?itsmeprinceshoprules"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
                name: "Prince-Kun • ItsMe Prince Shop",
                iconURL:
                    "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("Rules & Information")
            .setThumbnail(message.author.displayAvatarURL())
            .setDescription(ItsMePrinceRules + '**You accept the rules by registering and you also agree to any future updates or changes in the value of PP CASH. It is your responsibility to stay updated with the latest rules.**\n\nTo register, use \`/register\`')
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

            await message.reply({ embeds: [embed] });
    },
};
