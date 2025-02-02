import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";

import commands from "./commandHandler";
import deployCommands from "./deployCommands";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on("ready", async (c) => {
    console.log(`[ ${c.user.username} ] 💚 IS ONLINE !`);
    await deployCommands();
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

client.login(process.env.DISCORD_BOT_TOKEN);
