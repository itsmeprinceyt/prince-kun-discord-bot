"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_NoDM_NoAdmin_1 = require("../utility/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/logger-custom");
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const MegaPurgeCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("mega-purge")
        .setDescription("Deletes ALL messages in the current channel, including those older than 14 days."),
    async execute(interaction) {
        if (!interaction.guild) {
            await interaction.reply({
                content: "This is a Server-Only Command! 🖕",
                flags: 64,
            });
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
            return;
        }
        const ownerId = interaction.guild.ownerId;
        if (interaction.user.id !== ownerId) {
            await interaction.reply({
                content: "🚫 Only the server owner can use this command!",
                flags: 64,
            });
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
            return;
        }
        const channel = interaction.channel;
        let messagesDeleted = 0;
        const timeLimit = Date.now() - 14 * 24 * 60 * 60 * 1000;
        try {
            await interaction.deferReply({ flags: 64, });
            let fetched;
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
                        }
                        catch (err) {
                            if (err.code === 50013) {
                                console.warn(`❌ Missing permissions to delete: ${msg.id}`);
                            }
                            else if (err.code === 20016) {
                                console.warn(`⚠️ Rate limited! Waiting for 3 sec...`);
                                await delay(3000);
                            }
                            else {
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
            }
            else {
                await interaction.editReply({
                    content: `✅ Successfully deleted **${messagesDeleted}** messages!`,
                });
                const member = interaction.member;
                const userName = member?.displayName || interaction.user.username;
                (0, logger_custom_1.logger_custom)(userName, "mega-purge", `Deleted ${messagesDeleted} messages in #${channel.name}`);
            }
        }
        catch (error) {
            console.error("Error in mega-purge command:", error);
            await interaction.editReply({
                content: "❌ An error occurred while deleting messages!",
            });
        }
    },
};
exports.default = MegaPurgeCommand;
