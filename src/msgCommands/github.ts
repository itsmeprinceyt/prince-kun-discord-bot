import { Message, EmbedBuilder } from "discord.js";

export default {
    triggers: [".?github"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
                name: "Prince-Kun • GitHub",
                iconURL:
                    "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("@itsmeprinceyt")
            .setDescription(
                `I am a passionate developer from India learning new things and on my way to becoming a Full Stack Developer!😊
                
                [Connect with me on GitHub !](https://github.com/itsmeprinceyt)`
            )
            .setImage(
                "https://media.discordapp.net/attachments/1336322293437038602/1337030918245711893/GitHub.png"
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
