"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const path_1 = require("path");
const msgCommands = new discord_js_1.Collection();
const commandFolders = ["msgCommands", "itsmeprinceshopMsgCommands"];
for (const folder of commandFolders) {
    const commandPath = (0, path_1.join)(__dirname, folder);
    const commandFiles = (0, fs_1.readdirSync)(commandPath).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
    for (const file of commandFiles) {
        const commandModule = require(`${commandPath}/${file}`);
        const command = commandModule.default;
        if (command && Array.isArray(command.triggers)) {
            for (const trigger of command.triggers) {
                msgCommands.set(trigger, command);
            }
        }
        else {
            console.warn(`[ ERROR ] Message command ${file} in ${folder} is missing "triggers" or "execute"!`);
        }
    }
}
console.log(`[ INFO ] Registering Message commands. | Commands: ${msgCommands.size}`);
exports.default = msgCommands;
