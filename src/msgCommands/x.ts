import { Message, EmbedBuilder } from "discord.js";

export default {
    triggers: [".?x", ".?twitter"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
                name: "Prince-Kun • X",
                iconURL:
                    "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("@itsmeprinceyt")
            .setDescription(
                `You can follow me on X 🌟🌻 
                
                [Click Here To Follow !](https://x.com/itsmeprinceyt)`
            )
            .setImage(
                "https://media.discordapp.net/attachments/1336322293437038602/1337027227598196778/X.png"
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
