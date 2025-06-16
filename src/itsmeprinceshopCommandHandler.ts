import { Collection } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { Command } from "./types/Command.type";

const itsmeprinceshopCommands = new Collection<string, Command>();
const isDev = process.env.NODE_ENV !== 'production';

const commandFiles = readdirSync(join(__dirname, "itsmeprinceshop")).filter(
  (file) => file.endsWith(".ts") || file.endsWith(".js")
);

for (const file of commandFiles) {
  const commandModule = require(`./itsmeprinceshop/${file}`);
  const command: Command = commandModule.default;
  if (command && command.data) {
    itsmeprinceshopCommands.set(command.data.name, command);
  } else {
    console.warn(`[ ERROR ] Command at ${file} is missing "data" or "execute"!`);
  }
}

console.log(`[ INFO ] ItsMe Prince Shop - Commands are being loaded into the script. `);

export default itsmeprinceshopCommands;
