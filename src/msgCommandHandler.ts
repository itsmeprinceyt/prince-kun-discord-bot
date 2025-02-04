import { readdirSync } from "fs";
import path from "path";
import { Collection } from "discord.js";

const msgCommands = new Collection<string, any>();

const commandsPath = path.join(__dirname, "msgCommands");

const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    import(filePath).then((command) => {
        if (command.default && command.default.trigger) {
            msgCommands.set(command.default.trigger, command.default);
        }
    });
}

export default msgCommands;
