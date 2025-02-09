import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    TextChannel,
    GuildMember,
    Collection,
    Message
} from "discord.js";

import { Command } from "../types/Command";
import { logger_NoDM_NoAdmin } from "../utility/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/logger-custom";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MegaPurgeCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("mega-purge")
        .setDescription("Deletes ALL messages in the current channel, including those older than 14 days."),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild) {
            await interaction.reply({
                content: "❌ This command can only be used in a server!",
                flags: 64,
            });
            logger_NoDM_NoAdmin(interaction);
            return;
        }

        const ownerId = interaction.guild.ownerId;
        if (interaction.user.id !== ownerId) {
            await interaction.reply({
                content: "🚫 Only the server owner can use this command!",
                flags: 64,
            });
            logger_NoDM_NoAdmin(interaction);
            return;
        }

        const channel = interaction.channel as TextChannel;
        let messagesDeleted = 0;
        const timeLimit = Date.now() - 14 * 24 * 60 * 60 * 1000; 

        try {
            await interaction.deferReply({ flags: 64, });

            let fetched: Collection<string, Message>;
            do {
                fetched = await channel.messages.fetch({ limit: 100 });
                const messagesToBulkDelete = fetched.filter(msg => msg.createdTimestamp >= timeLimit);
                if (messagesToBulkDelete.size > 0) {
                    await channel.bulkDelete(messagesToBulkDelete, true);
                    messagesDeleted += messagesToBulkDelete.size;
                }

                for (const msg of fetched.values()) {
                    if (msg.createdTimestamp < timeLimit) {
                        try {
                            await msg.delete();
                            messagesDeleted++;
                            await delay(1500);
                        } catch (err: any) {
                            if (err.code === 50013) {
                                console.warn(`❌ Missing permissions to delete: ${msg.id}`);
                            } else if (err.code === 20016) {
                                console.warn(`⚠️ Rate limited! Waiting for 3 sec...`);
                                await delay(3000);
                            } else {
                                console.warn(`❌ Could not delete message: ${msg.id}`, err);
                            }
                        }
                    }
                }

            } while (fetched.size > 0);

            if (messagesDeleted === 0) {
                await interaction.editReply({
                    content: "❌ No messages were deleted!",
                });
            } else {
                await interaction.editReply({
                    content: `✅ Successfully deleted **${messagesDeleted}** messages!`,
                });
                const member = interaction.member as GuildMember;
                const userName = member?.displayName || interaction.user.username;
                logger_custom(userName, "mega-purge", `Deleted ${messagesDeleted} messages in #${channel.name}`);
            }
        } catch (error) {
            console.error("Error in mega-purge command:", error);
            await interaction.editReply({
                content: "❌ An error occurred while deleting messages!",
            });
        }
    },
};

export default MegaPurgeCommand;
