import { Message } from "discord.js";
import { BOT_ID } from "../utility/botId";
const allowedBotIds = [BOT_ID[0].roleId, BOT_ID[1].roleId, BOT_ID[2].roleId, BOT_ID[3].roleId];
const Mazoku = BOT_ID[2].roleId;
const Lumina = BOT_ID[3].roleId;

export default {
    triggers: [".?delete"],
    async execute(message: Message) {
        if (!message.reference) return;
        const repliedTo = await message.channel.messages.fetch(message.reference.messageId!).catch(() => null);
        if (!repliedTo) return;
        if (!repliedTo.author.bot || !allowedBotIds.includes(repliedTo.author.id)) return;

        const embed = repliedTo.embeds[0];
        const embedTitle = embed.title || "";
        const embedAuthor = embed.author?.name || "";
        const embedDescription = embed.description || "";
        const embedFooter = embed.footer?.text || "";

        const userDisplayName = message.member?.displayName || message.author.username;
        const globalName = message.author.globalName ?? message.author.username;
        const userUsername = message.author.username;
        const userCapitalizedUsername = userUsername.charAt(0).toUpperCase() + userUsername.slice(1);
        const userId = message.author.id;
        const contentToCheck = `${embedTitle} ${embedAuthor} ${embedDescription} ${embedFooter}`;
        if (
            contentToCheck.includes(userDisplayName) ||
            contentToCheck.includes(userUsername) ||
            contentToCheck.includes(userCapitalizedUsername) ||
            contentToCheck.includes(`<@${userId}>`) ||
            contentToCheck.includes(globalName)
        ) {
            await repliedTo.delete();
            const replyMessage = await message.reply("✅ Bot message deleted successfully." + '\n' + '-# Supported bot\'s: Karuta / Sofi / Mazoku / Lumina');
            setTimeout(async () => {
                await replyMessage.delete().catch(console.error);
                await message.delete().catch(console.error);
            }, 5000);
            return
        }

        let triggeredByUser = false;

        if (repliedTo.reference) {
            const originalMessage = await message.channel.messages.fetch(repliedTo.reference.messageId!).catch(() => null);
            if (originalMessage && originalMessage.author.id === message.author.id) {
                triggeredByUser = true;
            }
        }

        if (!triggeredByUser) {
            const replyMessage = await message.reply("⚠️ You can only delete bot messages if they were triggered by you.");
            setTimeout(async () => {
                await replyMessage.delete().catch(() => null);
                await message.delete().catch(() => null);
            }, 5000);
            return;
        }

        try {
            await repliedTo.delete();
            const replyMessage = await message.reply("✅ Bot message deleted successfully." + '\n' + '-# Supported bot\'s: Karuta / Sofi / Mazoku / Lumina');
            setTimeout(async () => {
                await replyMessage.delete().catch(console.error);
                await message.delete().catch(console.error);
            }, 5000);
        } catch (error) {
            const error_message = await message.reply("❌ Failed to delete the message. I might not have sufficient permissions.");
            setTimeout(async () => {
                await error_message.delete().catch(console.error);
                await message.delete().catch(console.error);
            }, 5000);
        }
    },
};
