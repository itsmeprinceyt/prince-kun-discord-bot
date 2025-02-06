import { Message, EmbedBuilder } from "discord.js";

export default {
    triggers: [".?youtubeclips", ".?ytclips",".?clips"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
                name: "Prince-Kun • YouTube Clips/Highlights",
                iconURL:
                    "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("ItsMe Prince • Clips/Highlights")
            .setDescription(
                `Find all the amazing community-made clips or stream highlights right here!🌟🌻 
                
                [Check out my Clips/Highlights !](https://www.youtube.com/watch?v=U9CD1tFw1mg&list=PLiFooJ43_R5R2usnfqq4D1JkG2Bz1A8VB&index=1)`
            )
            .setImage(
                "https://media.discordapp.net/attachments/1336322293437038602/1337031725762482278/YouTubeClips.png"
            )
            .setFooter({
                text: `${message.author.username} | ${new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
                iconURL: message.author.displayAvatarURL(),
            });

        await message.reply({ embeds: [embed] });
    },
};
