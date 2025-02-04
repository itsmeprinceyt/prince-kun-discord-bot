import { Collection } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";

const msgCommands = new Collection<string, any>();

const commandFiles = readdirSync(join(__dirname, "msgCommands")).filter(
    (file) => file.endsWith(".ts") || file.endsWith(".js")
);

for (const file of commandFiles) {
    // Console Logs
    const CommandsLoad = `[ INFO ] All Message Commands are loaded and are ready to be invoked. `;
    const CommandsLoadError = `[ ERROR ] Message command ${file} is missing "trigger" or "execute"!`;
    /* ====================================== */
    const commandModule = require(`./msgCommands/${file}`);
    const command = commandModule.default;

    if (command && command.trigger) {
        msgCommands.set(command.trigger, command);
        console.log(`[ INFO ] Registering Message commands. | Commands: ${msgCommands.size}`);
    } else {
        console.warn(CommandsLoadError);
    }
}

export default msgCommands;
