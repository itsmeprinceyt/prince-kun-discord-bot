import { Message } from "discord.js";

export default {
    trigger: ".?youtube",
    async execute(message: Message) {
        await message.reply("📺 Check out my YouTube channel: https://www.youtube.com/@itsmeprinceyt");
    }
};
