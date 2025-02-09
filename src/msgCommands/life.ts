import { Message, EmbedBuilder } from "discord.js";

export default {
    triggers: [".?life"],
    async execute(message: Message) {
        await message.reply(`## 😔 Life Not Found. Error 420!`).then((msg) => {
            setTimeout(() => msg.delete().catch(() => { }), 10000);
        });
    },
};
