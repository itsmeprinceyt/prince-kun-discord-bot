"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const path_1 = require("path");
const itsmeprinceshopCommands = new discord_js_1.Collection();
const isDev = process.env.NODE_ENV !== 'production';
const commandFiles = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, "itsmeprinceshop")).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
for (const file of commandFiles) {
    const commandModule = require(`./itsmeprinceshop/${file}`);
    const command = commandModule.default;
    if (command && command.data) {
        itsmeprinceshopCommands.set(command.data.name, command);
    }
    else {
        console.warn(`[ ERROR ] Command at ${file} is missing "data" or "execute"!`);
    }
}
console.log(`[ INFO ] ItsMe Prince Shop - Commands are being loaded into the script. `);
exports.default = itsmeprinceshopCommands;
