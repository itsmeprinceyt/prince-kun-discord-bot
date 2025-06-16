"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LifeQuotes_1 = require("../utility/LifeQuotes");
exports.default = {
    triggers: [".?life"],
    async execute(message) {
        const randomQuote = LifeQuotes_1.lifeQuotes[Math.floor(Math.random() * LifeQuotes_1.lifeQuotes.length)];
        await message.reply(`-# 💭 **So you've come . . . here's one of the truth:**\n> ${randomQuote}`);
    },
};
