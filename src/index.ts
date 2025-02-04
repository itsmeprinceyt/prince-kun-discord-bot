import "dotenv/config";
import chalk from 'chalk';
import { Client, GatewayIntentBits, Partials } from "discord.js";

import commands from "./commandHandler";
import msgCommands from "./msgCommandHandler";
import deployCommands from "./deployCommands";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel],
});

client.on("ready", async (c) => {
    await deployCommands();
    console.log(chalk.green(`[ ${c.user.username} ] 💚 IS ONLINE !`));
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "[ ERROR ] There was an error executing this command!",
            ephemeral: true,
        });
    }
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase().trim();
    const command = msgCommands.get(content);
    const location = message.guild ? `Server: ${message.guild.name}` : "DM";

    if (command) {
        console.log(chalk.underline(`[ INFO ]`) + '\n'
            + chalk.yellow(`User: ${message.author.username}`) + '\n'
            + chalk.magenta(`Message Command: ${content}`) + '\n'
            + chalk.cyan(`Location: ${location}`)
        );

        try {
            await command.execute(message);
            console.log(chalk.green(`[ SUCCESS ] Message Command Executed!`));
        } catch (error) {
            console.error(chalk.red(`[ ERROR ] Failed to execute ${content}:`), error);
            await message.reply("⚠️ Error executing command!");
        }
    }
});
client.login(process.env.DISCORD_BOT_TOKEN);
