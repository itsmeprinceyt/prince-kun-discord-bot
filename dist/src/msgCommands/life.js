"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    triggers: [".?life"],
    async execute(message) {
        await message.reply(`## 😔 Life Not Found. Error 420!`);
    },
};
