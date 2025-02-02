import { Collection } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { Command } from "./types/Command";
const commands = new Collection<string, Command>();
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) =>
  file.endsWith(".ts")
);
for (const file of commandFiles) {
  // Console Logs
  const CommandsLoad = `[ INFO ] All Commands are loaded and are ready to be invoked. `;
  const CommandsLoadError = `[ ERROR ] Command at ${file} is missing "data" or "execute"!`;
  /* ====================================== */
  const commandModule = require(`./commands/${file}`);
  const command: Command = commandModule.default;

  if (command && command.data) {
    commands.set(command.data.name, command);
    console.log(CommandsLoad);
  } else {
    console.warn(CommandsLoadError);
  }
}

export default commands;
