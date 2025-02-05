import { Message, EmbedBuilder } from "discord.js";

export default {
    triggers: [".?youtube", ".?yt"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
                name: "Prince-Kun • Subscribe to my YouTube Channel",
                iconURL:
                    "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("ItsMe Prince")
            .setDescription(
                `Hello, I'm Prince! I love diving into PC games and sharing my adventures with you. My channel features a mix of content: exciting gaming sessions, IRL drawing streams, and fun coding projects. Sometimes, I also chat about various topics that pique my interest. If you enjoy what you see,  then make sure to subscribe 🌟🌻 
                
                A friendly reminder: I upload content based on my mood.
                
                [Click Here To Subscribe or Visit !!](https://www.youtube.com/channel/UC9UQVp8grhcVatbMcf0sa5w)`
            )
            .setImage(
                "https://media.discordapp.net/attachments/1336322293437038602/1336708959737745520/YouTubeChannel.png"
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
