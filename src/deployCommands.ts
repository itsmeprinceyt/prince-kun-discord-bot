import { REST, Routes } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import "dotenv/config";
import { Command } from "./types/Command.type";
import itsmeprinceshopCommands from "./itsmeprinceshopCommandHandler";

async function deployCommands() {
    const commands = [];

    const commandFiles = readdirSync(join(__dirname, "commands")).filter(
        (file) => file.endsWith(".ts") || file.endsWith(".js")
    );

    for (const file of commandFiles) {
        const commandModule = require(`./commands/${file}`);
        const command: Command = commandModule.default;

        if (command && command.data) {
            commands.push(command.data.toJSON());
        }
    }

    for (const command of itsmeprinceshopCommands.values()) {
        if (command && command.data) {
            commands.push(command.data.toJSON());
        }
    }

    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN as string);

    try {
        console.log(`[ INFO ] Registering Slash commands. | Commands: ${commands.length}`);
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID as string), {
            body: commands,
        });
    } catch (error) {
        console.error(`[ ERROR ] Registering command failed: ${error}`);
    }
}

export default deployCommands;
