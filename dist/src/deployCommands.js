"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const path_1 = require("path");
require("dotenv/config");
const itsmeprinceshopCommandHandler_1 = __importDefault(require("./itsmeprinceshopCommandHandler"));
async function deployCommands() {
    const commands = [];
    const commandFiles = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, "commands")).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
    for (const file of commandFiles) {
        const commandModule = require(`./commands/${file}`);
        const command = commandModule.default;
        if (command && command.data) {
            commands.push(command.data.toJSON());
        }
    }
    for (const command of itsmeprinceshopCommandHandler_1.default.values()) {
        if (command && command.data) {
            commands.push(command.data.toJSON());
        }
    }
    const rest = new discord_js_1.REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN);
    try {
        console.log(`[ INFO ] Registering Slash commands. | Commands: ${commands.length}`);
        await rest.put(discord_js_1.Routes.applicationCommands(process.env.CLIENT_ID), {
            body: commands,
        });
    }
    catch (error) {
        console.error(`[ ERROR ] Registering command failed: ${error}`);
    }
}
exports.default = deployCommands;
