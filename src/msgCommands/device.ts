import { Message, EmbedBuilder } from "discord.js";

export default {
    triggers: [".?device", ".?mobile"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
                name: "Prince-Kun • Device",
                iconURL:
                    "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("Device")
            .setDescription(`I'm currently using \`IQOO NEO 7 ( 12+256 Variant) - Black\``)
            .setImage(
                "https://media.discordapp.net/attachments/1336322293437038602/1337045552030027786/Device.png"
            )
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    },
};
