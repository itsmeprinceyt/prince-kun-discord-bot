// DOT ENV
import dotenv from "dotenv";
dotenv.config();

// PACKAGE
import chalk from "chalk";
import {
  Client,
  GatewayIntentBits,
  Partials,
  ModalSubmitInteraction,
  Message,
  Events,
  ActivityType,
} from "discord.js";

// COMMAND HANDLER
import commands from "./commandHandler";
import itsmeprinceshopCommands from "./itsmeprinceshopCommandHandler";
import msgCommands from "./msgCommandHandler";

// DEPLOY COMMANDS
import deployCommands from "./deployCommands";

// LOGGER
import { getFormattedIST } from "./utility/loggers/time";

// MODALS
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
  handleDeleteUser,
} from "./modals/adminModals";
import { handleRedeemModalSubmit } from "./commands/new-redeems";

// DATABASE CONNECTION
import { initDB } from "./db";

// UTILITY IMPORTS
import { RolesPerms } from "./utility/uuid/RolesPerms";
import { CooldownTime } from "./utility/utils";
import { handleMessageUpdate } from "./msgCommands/bits";

const modalHandlers = new Map<
  string,
  (interaction: ModalSubmitInteraction) => Promise<void>
>([
  ["select_user", handleSelectUserSubmit],
  ["modify_points", handleModifySubmit],
  ["botUpdatesModal", handleBotModalSubmit],
  ["serverUpdatesModal", handleServerModalSubmit],
  ["shopUpdateModal", handleShopModalSubmit],
  ["newRedeemsModal", handleRedeemModalSubmit],
]);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

let memberPool: string[] = [];
let poolRefreshInFlight: Promise<void> | null = null;

async function refreshMemberPool(): Promise<void> {
  if (poolRefreshInFlight) return poolRefreshInFlight;

  poolRefreshInFlight = (async () => {
    try {
      const guilds = [...client.guilds.cache.values()];

      const results = await Promise.allSettled(
        guilds.map(async (guild) => {
          try {
            const fetched = await guild.members.fetch();
            return [...fetched.values()]
              .filter((m) => !m.user.bot)
              .map((m) => m.displayName);
          } catch {
            // Per-guild fallback to whatever is already cached locally
            return [...guild.members.cache.values()]
              .filter((m) => !m.user.bot)
              .map((m) => m.displayName);
          }
        }),
      );

      const names = results.flatMap((r) =>
        r.status === "fulfilled" ? r.value : [],
      );

      // Only swap in the new pool if we actually got something.
      // A transient failure will never wipe an existing good pool.
      if (names.length > 0) memberPool = names;
    } finally {
      poolRefreshInFlight = null;
    }
  })();

  return poolRefreshInFlight;
}

async function startBot() {
  console.log("[ DATABASE ] Checking database connection...");
  await initDB();

  client.once(Events.ClientReady, async (c) => {
    await deployCommands();
    await refreshMemberPool();

    const updatePresence = () => {
      const name =
        memberPool.length > 0
          ? memberPool[Math.floor(Math.random() * memberPool.length)]
          : null;

      if (!name) return;

      c.user.setPresence({
        status: "dnd",
        activities: [
          {
            name: `over ${name}'s soul. 🥸`,
            type: ActivityType.Watching,
          },
        ],
      });
    };

    updatePresence();
    setInterval(updatePresence, 15_000);
    setInterval(refreshMemberPool, 30 * 60 * 1000);

    // Keep the pool in sync cheaply between full refreshes.
    client.on(Events.GuildMemberAdd, (m) => {
      if (!m.user.bot) memberPool.push(m.displayName);
    });
    client.on(Events.GuildMemberRemove, (m) => {
      if (m.user.bot) return;
      const i = memberPool.indexOf(m.displayName);
      if (i !== -1) memberPool.splice(i, 1);
    });

    console.log(
      chalk.green(`[ ${c.user.username} ] 💚 IS ONLINE (DND Mode) !`),
    );
  });

  const cooldowns = new Map<string, number>();

  client.on("interactionCreate", async (interaction) => {
    const userId = interaction.user.id;
    const now = Date.now();

    if (interaction.isChatInputCommand()) {
      const commandName = interaction.commandName;
      const lastUsed = cooldowns.get(`${userId}-${commandName}`) || 0;

      if (now - lastUsed < CooldownTime) {
        const availableAt = Math.floor((lastUsed + CooldownTime) / 1000);

        await interaction.reply({
          content: `<@${userId}>, ⏳ You can use this command again <t:${availableAt}:R>.`,
          flags: 64,
        });
        return;
      }

      cooldowns.set(`${userId}-${commandName}`, now);

      const command =
        commands.get(commandName) || itsmeprinceshopCommands.get(commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "[ ERROR ] There was an error executing this command!",
          flags: 64,
        });
      }
    } else if (interaction.isButton()) {
      if (interaction.customId.startsWith("select_user")) {
        await handleSelectUser(interaction);
      } else if (interaction.customId.startsWith("delete_")) {
        await handleDeleteUser(interaction);
      } else if (interaction.customId.startsWith("modify_ppCash_")) {
        await handleModifyPP(interaction);
      } else if (interaction.customId.startsWith("modify_referral_")) {
        await handleModifyReferral(interaction);
      } else if (interaction.customId.startsWith("modify_purchases_")) {
        await handleModifyPurchases(interaction);
      } else if (interaction.customId.startsWith("modify_referred_")) {
        await handleModifyReferred(interaction);
      } else if (interaction.customId.startsWith("refresh_")) {
        await handleRefresh(interaction);
      }
    } else if (interaction.isModalSubmit()) {
      const customId = interaction.customId;
      if (customId === "select_user") {
        await handleSelectUserSubmit(interaction);
      } else if (customId.startsWith("modify_")) {
        await handleModifySubmit(interaction);
      } else {
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
      const mentionedUsers = message.mentions.users.filter(
        (user) => user.id !== client.user!.id,
      );

      if (mentionedUsers.size > 0) {
        const mentionedUser = mentionedUsers.first();
        if (!mentionedUser) return;

        const member = message.guild?.members.cache.get(mentionedUser.id);
        const Lali = RolesPerms.find((role) => role.name === "Lali");

        if (member?.id === message.guild?.ownerId) {
          message.channel.send(`## **Nah, he's a good person 😎**`);
        } else if (member?.id === Lali?.roleId) {
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
      .find((cmd) =>
        cmd.triggers.some((trigger) => message.content.startsWith(trigger)),
      );

    if (command) {
      const userId = message.author.id;
      const now = Date.now();
      const lastUsed = cooldowns.get(userId) || 0;

      if (now - lastUsed < CooldownTime) {
        const availableAt = Math.floor((lastUsed + CooldownTime) / 1000);
        await message.reply(
          `<@${userId}> ⏳ You can use this command again <t:${availableAt}:R>.`,
        );
        return;
      }

      cooldowns.set(userId, now);

      console.log(
        chalk.underline(`[ INFO ]`) +
          "\n" +
          chalk.yellow(
            `User: ${message.member?.displayName || message.author.username}`,
          ) +
          "\n" +
          chalk.yellow(`Username: ${message.author.username}`) +
          "\n" +
          chalk.blue(getFormattedIST()) +
          "\n" +
          chalk.magenta(`Message Command: ${content}`) +
          "\n" +
          chalk.cyan(
            `Location: ${message.guild ? `Server: ${message.guild.name}` : "DM"}`,
          ),
      );
      try {
        await command.execute(message, args);
        console.log(
          chalk.green(`[ SUCCESS ] Message Command Executed: ${content}\n`),
        );
      } catch (error) {
        console.error(
          chalk.red(`[ ERROR ] Failed to execute ${content}:`),
          error,
        );
        await message.reply("⚠️ Error executing command!");
      }
    }
  });

  client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
    if (newMessage.partial) {
      await newMessage.fetch();
    }
    if (oldMessage.partial) {
      await oldMessage.fetch();
    }

    await handleMessageUpdate(oldMessage as Message, newMessage as Message);
  });

  client.login(process.env.DISCORD_BOT_TOKEN);
}

startBot().catch((error) => {
  console.error("❌ Failed to start bot:", error);
});
