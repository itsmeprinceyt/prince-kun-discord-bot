"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const chalk_1 = __importDefault(require("chalk"));
const discord_js_1 = require("discord.js");
const commandHandler_1 = __importDefault(require("./commandHandler"));
const msgCommandHandler_1 = __importDefault(require("./msgCommandHandler"));
const deployCommands_1 = __importDefault(require("./deployCommands"));
const bot_updates_1 = require("./commands/bot-updates");
const server_updates_1 = require("./commands/server-updates");
const modalHandlers = new Map([
    ["botUpdatesModal", bot_updates_1.handleModalSubmit],
    ["serverUpdatesModal", server_updates_1.handleServerModalSubmit],
]);
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.DirectMessages
    ],
    partials: [discord_js_1.Partials.Channel],
});
client.on("ready", async (c) => {
    await (0, deployCommands_1.default)();
    c.user.setPresence({
        status: "dnd",
        activities: [
            {
                name: "over y'all souls. 🥸",
                type: 3,
            },
        ],
    });
    console.log(chalk_1.default.green(`[ ${c.user.username} ] 💚 IS ONLINE (DND Mode) !`));
});
client.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = commandHandler_1.default.get(interaction.commandName);
        if (!command)
            return;
        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(error);
            await interaction.reply({
                content: "[ ERROR ] There was an error executing this command!",
                ephemeral: true,
            });
        }
    }
    else if (interaction.isModalSubmit()) {
        const handler = modalHandlers.get(interaction.customId);
        if (handler) {
            await handler(interaction);
        }
        else {
            console.warn(`[ WARNING ] No handler found for modal: ${interaction.customId}`);
        }
    }
});
client.on("messageCreate", async (message) => {
    if (message.author.bot)
        return;
    if (client.user && message.mentions.has(client.user.id) && !message.mentions.everyone) {
        message.channel.send("## 🥸**POK U BICH**🖕").then((msg) => {
            setTimeout(() => msg.delete().catch(() => { }), 2000);
        });
        return;
    }
    const content = message.content.toLowerCase();
    const args = message.content.split(" ").slice(1).join(" ");
    const command = [...msgCommandHandler_1.default.values()]
        .sort((a, b) => b.triggers[0].length - a.triggers[0].length)
        .find(cmd => cmd.triggers.some(trigger => message.content.startsWith(trigger)));
    if (command) {
        console.log(chalk_1.default.underline(`[ INFO ]`) +
            "\n" +
            chalk_1.default.yellow(`User: ${message.member?.displayName || message.author.username}`) +
            "\n" +
            chalk_1.default.yellow(`Username: ${message.author.username}`) +
            "\n" +
            chalk_1.default.magenta(`Message Command: ${content}`) +
            "\n" +
            chalk_1.default.cyan(`Location: ${message.guild ? `Server: ${message.guild.name}` : "DM"}`));
        try {
            await command.execute(message, args); // Pass args to the command
            console.log(chalk_1.default.green(`[ SUCCESS ] Message Command Executed: ${content}\n`));
        }
        catch (error) {
            console.error(chalk_1.default.red(`[ ERROR ] Failed to execute ${content}:`), error);
            await message.reply("⚠️ Error executing command!");
        }
    }
});
client.login(process.env.DISCORD_BOT_TOKEN);
