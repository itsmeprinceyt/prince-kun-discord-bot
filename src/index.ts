import dotenv from "dotenv";
dotenv.config();

import chalk from "chalk";
import {
    Client,
    GatewayIntentBits,
    Partials,
    ModalSubmitInteraction,
} from "discord.js";

import commands from "./commandHandler";
import itsmeprinceshopCommands from "./itsmeprinceshopCommandHandler";
import msgCommands from "./msgCommandHandler";
import deployCommands from "./deployCommands";
import { getFormattedIST } from "./utility/time";
import { handleModalSubmit as handleBotModalSubmit } from "./commands/bot-updates";
import { handleServerModalSubmit } from "./commands/server-updates";
import { handleShopModalSubmit } from "./commands/shop-updates";
import { 
    handleSelectUser, 
    handleSelectUserSubmit, 
    handleModifyPP,
    handleModifyReferral,
    handleModifyPurchases,
    handleModifyReferred,
    handleRefresh,
    handleModifySubmit, 
    handleDeleteUser 
} from "./modals/adminModals";
import { initDB } from "./db";

const modalHandlers = new Map<string, (interaction: ModalSubmitInteraction) => Promise<void>>([
    ["select_user", handleSelectUserSubmit],
    ["modify_points", handleModifySubmit],
    ["botUpdatesModal", handleBotModalSubmit],
    ["serverUpdatesModal", handleServerModalSubmit],
    ["shopUpdateModal", handleShopModalSubmit]
]);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel],
});

async function startBot() {
    console.log("[ DATABASE ] Checking database connection...");
    await initDB();

    client.on("ready", async (c) => {
        await deployCommands();
        async function updatePresence() {
            try {
                let allMembers: string[] = [];
                for (const [guildId, guild] of client.guilds.cache) {
                    try {
                        await guild.members.fetch();
                        const members = guild.members.cache
                            .filter(member => !member.user.bot)
                            .map(member => member.displayName);
                        allMembers = allMembers.concat(members);
                    } catch (error) {
                        console.error(`[ ERROR ] Could not fetch members from guild: ${guildId}`, error);
                    }
                }

                let presenceText = "y'all souls";
                if (allMembers.length > 0) {
                    presenceText = `${allMembers[Math.floor(Math.random() * allMembers.length)]}'s soul`;
                }

                c.user.setPresence({
                    status: "dnd",
                    activities: [
                        {
                            name: `over ${presenceText}. 🥸`,
                            type: 3,
                        },
                    ],
                });

            } catch (error) {
                console.error("[ ERROR ] Failed to update presence:", error);
                console.log(chalk.cyan(`[ INFO ] Setting 'over y'all souls' as default activity. `));
                c.user.setPresence({
                    status: "dnd",
                    activities: [
                        {
                            name: `over y'all souls. 🥸`,
                            type: 3,
                        },
                    ],
                });
            }
        }

        updatePresence();
        setInterval(updatePresence, 15000);

        console.log(chalk.green(`[ ${c.user.username} ] 💚 IS ONLINE (DND Mode) !`))
    });


    client.on("interactionCreate", async (interaction) => {
        if (interaction.isChatInputCommand()) {
            const command = commands.get(interaction.commandName) || itsmeprinceshopCommands.get(interaction.commandName);
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
        } 
        else if (interaction.isButton()) {
            if (interaction.customId.startsWith("select_user")) {
                await handleSelectUser(interaction);
            } else if (interaction.customId.startsWith("delete_")) {
                await handleDeleteUser(interaction);
            } else if (interaction.customId.startsWith("modify_ppCash_")) {
                await handleModifyPP(interaction);
            } else if (interaction.customId.startsWith("modify_referral_")) {
                await handleModifyReferral(interaction);
            } else if(interaction.customId.startsWith("modify_purchases_")) {
                await handleModifyPurchases(interaction);
            } else if(interaction.customId.startsWith("modify_referred_")) {
                await handleModifyReferred(interaction);
            } else if(interaction.customId.startsWith("refresh_")) {
                await handleRefresh(interaction);
            }
        } 
        else if (interaction.isModalSubmit()) {
            const customId = interaction.customId;
            if (customId === "select_user") {
                await handleSelectUserSubmit(interaction);
            } else if (customId.startsWith("modify_")) {
                await handleModifySubmit(interaction);
            }
            else {
                const handler = modalHandlers.get(customId);
                if (handler) {
                    await handler(interaction);
                } else {
                    console.warn(`[ WARNING ] No handler found for modal: ${customId}`);
                }
            }
        }
        
    });
    
    

    client.on("messageCreate", async (message) => {
        if (message.author.bot) return;
        if (!client.user) return;

        if (message.reference && message.content.includes("🖕")) {
            message.channel.send("## **🥸RIGHT BACK AT YA🖕**");
            return;
        }

        if (message.mentions.has(client.user.id) && !message.mentions.everyone) {
            const mentionedUsers = message.mentions.users.filter(user => user.id !== client.user!.id);

            if (mentionedUsers.size > 0) {
                const mentionedUser = mentionedUsers.first();
                if (!mentionedUser) return;

                const member = message.guild?.members.cache.get(mentionedUser.id);

                if (member?.id === message.guild?.ownerId) {
                    message.channel.send(`## **Nah, he's a good person 😎**`);
                } else if (member?.roles.cache.has("1039624778715250780")) {
                    message.channel.send(`## **Nah, she's a good person 😊**`);
                } else {
                    message.channel.send(`## **🥸Yes, ${mentionedUser} is a bich🤡**`);
                }
            } else {
                message.channel.send("## 🥸**POK U BICH**🖕");
            }
            return;
        }




        const content = message.content.toLowerCase();
        const args = message.content.split(" ").slice(1).join(" ");
        const command = [...msgCommands.values()]
            .sort((a, b) => b.triggers[0].length - a.triggers[0].length)
            .find(cmd => cmd.triggers.some(trigger => message.content.startsWith(trigger)));

        if (command) {
            console.log(
                chalk.underline(`[ INFO ]`) +
                "\n" +
                chalk.yellow(`User: ${message.member?.displayName || message.author.username}`) +
                "\n" +
                chalk.yellow(`Username: ${message.author.username}`) +
                "\n" +
                chalk.blue(getFormattedIST()) +
                "\n" +
                chalk.magenta(`Message Command: ${content}`) +
                "\n" +
                chalk.cyan(`Location: ${message.guild ? `Server: ${message.guild.name}` : "DM"}`)
            );
            try {
                await command.execute(message, args);
                console.log(chalk.green(`[ SUCCESS ] Message Command Executed: ${content}\n`));
            } catch (error) {
                console.error(chalk.red(`[ ERROR ] Failed to execute ${content}:`), error);
                await message.reply("⚠️ Error executing command!");
            }
        }
    });

    client.login(process.env.DISCORD_BOT_TOKEN);
}

startBot().catch(error => {
    console.error("❌ Failed to start bot:", error);
});
