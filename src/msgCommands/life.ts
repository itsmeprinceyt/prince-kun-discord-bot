import { Message, EmbedBuilder } from "discord.js";
import { lifeQuotes } from "../utility/LifeQuotes";

export default {
  triggers: [".?life"],
  async execute(message: Message) {
    const randomQuote =
      lifeQuotes[Math.floor(Math.random() * lifeQuotes.length)];
    await message.reply(`-# 💭 **${randomQuote}**`);
  },
};
