import { Message, EmbedBuilder } from "discord.js";

export default {
    triggers: [".?instagram", ".?insta"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
                name: "Prince-Kun • Instagram",
                iconURL:
                    "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("@itsmeprinceyt")
            .setDescription(
                `You can follow me on Instagram 🌟🌻 
                
                [Click Here To Follow !](https://www.instagram.com/itsmeprinceyt)`
            )
            .setImage(
                "https://media.discordapp.net/attachments/1336322293437038602/1337026804413632652/Instagram.png"
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
