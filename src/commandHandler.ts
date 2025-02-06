import { Collection } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { Command } from "./types/Command";
const commands = new Collection<string, Command>();
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) =>
  file.endsWith(".ts")
);

for (const file of commandFiles) {
  const commandModule = require(`./commands/${file}`);
  const command: Command = commandModule.default;
  
  if (command && command.data) {
    commands.set(command.data.name, command);
  } else {
    console.warn(`[ ERROR ] Command at ${file} is missing "data" or "execute"!`);
  }
}

console.log(`[ INFO ] Commands are being loaded into the script. `);
export default commands;
