import { Message, EmbedBuilder } from "discord.js";
import { ItsMePrinceRules } from "../utility/itsmeprince-rules";

export default {
    triggers: [".?shoprules", ".?rulesshop", ".?itsmeprinceshoprules"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(0x006eff)
            .setTitle("ItsMe Prince Shop - Rules")
            .setThumbnail(message.author.displayAvatarURL())
            .setDescription(ItsMePrinceRules + 'Use `/register` to begin.')
            .setFooter({
                text: `${message.author.username} | ${new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Kolkata",
                })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
                iconURL: message.author.displayAvatarURL(),
            });

            await message.reply({ embeds: [embed] });
    },
};
