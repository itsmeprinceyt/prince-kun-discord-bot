import { Collection } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";

const msgCommands = new Collection<string, any>();

const commandFiles = readdirSync(join(__dirname, "msgCommands")).filter(
    (file) => file.endsWith(".ts") || file.endsWith(".js")
);

for (const file of commandFiles) {
    const commandModule = require(`./msgCommands/${file}`);
    const command = commandModule.default;

    if (command && command.triggers) {
        if (Array.isArray(command.triggers)) {
            for (const trigger of command.triggers) {
                msgCommands.set(trigger, command);
            }
        } else {
            console.warn(`[ ERROR ] Message command ${file} "triggers" must be an array!`);
        }
    } else {
        console.warn(`[ ERROR ] Message command ${file} is missing "triggers" or "execute"!`);
    }
}

console.log(`[ INFO ] Registering Message commands. | Commands: ${msgCommands.size}`);
export default msgCommands;
