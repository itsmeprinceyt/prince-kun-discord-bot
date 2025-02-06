import { Message, EmbedBuilder } from "discord.js";

export default {
    triggers: [".?paypal"],
    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
                name: "Prince-Kun • PayPal",
                iconURL:
                    "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("Support Me on Paypal")
            .setDescription(
                `As a streamer and developer, I am committed to delivering high-quality content for my audience to enjoy and creating cool projects for everyone to use. All donations will be reinvested to improve my overall quality of life, allowing me to provide better streams and coding projects.

I sincerely appreciate anyone who chooses to support me financially. Thank you for your generosity! 😊
                
                [Click here to support me on PayPal !](https://paypal.me/itsmeprinceyt)`
            )
            .setImage(
                "https://media.discordapp.net/attachments/1336322293437038602/1337032557258342463/PayPal.png"
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
