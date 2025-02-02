import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { Command } from './types/Command';

const commands = new Collection<string, Command>();

const commandFiles = readdirSync(join(__dirname, 'commands')).filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
  const commandModule = require(`./commands/${file}`);
  const command: Command = commandModule.default; // Assuming default export

  if (command && command.data ) {
    commands.set(command.data.name, command);
    console.log(`Command is set: ${command.data.name}`)
  } else {
    console.warn(`Command at ${file} is missing "data" or "execute"!`);
  }
}

export default commands;
