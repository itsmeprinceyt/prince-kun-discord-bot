import { Message, EmbedBuilder, AttachmentBuilder } from "discord.js";
import path from "path";
import fs from "fs";

export default {
    triggers: [".?artwork"],
    
    async execute(message: Message) {
        const logoPath = path.join(__dirname, "../public/DiscordBotLogo.png");
        if (!fs.existsSync(logoPath)) {
            return message.reply("The artwork image could not be found.");
        }
        const attachment = new AttachmentBuilder(logoPath, { name: "DiscordBotLogo.png" });
        const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
                name: "Prince-Kun • Artwork",
                iconURL:
                    "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("Artwork Credit")
            .setDescription(`A huge thank you to <@793154222806925333> for creating this amazing artwork for the Prince-Kun! If you're looking for fantastic artwork commissions, be it anime-related or chibi related then make sure to reach out to them!`)
            .setImage("attachment://DiscordBotLogo.png") 
            .setFooter({
                text: `${message.author.username} | ${new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Kolkata",
                })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
                iconURL: message.author.displayAvatarURL(),
            });
            
        await message.reply({ embeds: [embed], files: [attachment] });
    },
};
