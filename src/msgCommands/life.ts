import { Message, EmbedBuilder } from "discord.js";
import { lifeQuotes } from "../utility/LifeQuotes";

export default {
    triggers: [".?life"],
    async execute(message: Message) {
        const randomQuote = lifeQuotes[Math.floor(Math.random() * lifeQuotes.length)];
        await message.reply(`-# 💭 **So you've come . . . here's one of the truth:**\n> ${randomQuote}`);
    },
};