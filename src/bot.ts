import { GatewayIntentBits, Collection } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { ExtendedClient } from './types/Client'; // Adjust path if needed
import { Command } from './types/Command';

config(); // Load environment variables

if (!process.env.DISCORD_TOKEN) {
    console.error('DISCORD_TOKEN is not set in .env!');
    process.exit(1);
}

const client = new ExtendedClient({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection<string, Command>();

// Main function to initialize the bot
const main = async () => {
    try {
        // Load commands
        const commandsPath = path.join(__dirname, 'commands');
        const commandFolders = fs.readdirSync(commandsPath);

        for (const folder of commandFolders) {
            const folderPath = path.join(commandsPath, folder);
            const commandFiles = fs
                .readdirSync(folderPath)
                .filter(file => file.endsWith('.ts') || file.endsWith('.js'));

            for (const file of commandFiles) {
                try {
                    const commandModule = await import(path.join(folderPath, file));
                    const command: Command = commandModule.command;
                    client.commands.set(command.data.name, command);
                } catch (error) {
                    console.error(`Error loading command ${file}:`, error);
                }
            }
        }

        // Load events
        const eventsPath = path.join(__dirname, 'events');
        const eventFiles = fs
            .readdirSync(eventsPath)
            .filter(file => file.endsWith('.ts') || file.endsWith('.js'));

        for (const file of eventFiles) {
            try {
                const eventModule = await import(path.join(eventsPath, file));
                const event = eventModule.event;

                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args));
                } else {
                    client.on(event.name, (...args) => event.execute(...args));
                }
            } catch (error) {
                console.error(`Error loading event ${file}:`, error);
            }
        }

        // Log bot startup
        client.once('ready', () => {
            console.log(`Logged in as ${client.user?.tag}!`);
        });

        // Login to Discord
        await client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
        console.error('An error occurred while initializing the bot:', error);
        process.exit(1);
    }
};

// Run the main function
main();
