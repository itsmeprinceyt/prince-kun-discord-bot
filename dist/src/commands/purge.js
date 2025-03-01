"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_NoDM_NoAdmin_1 = require("../utility/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/logger-custom");
const rolePerms_1 = require("../utility/rolePerms");
const Moderator = rolePerms_1.RolesPerms[2].roleId;
const PurgeCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("purge")
        .setDescription("Deletes messages in the current channel based on time range.")
        .addStringOption(option => option.setName("deletemessages")
        .setDescription("Select message deletion range")
        .setRequired(true)
        .addChoices({ name: "Last 6 hours", value: "6h" }, { name: "Last 24 hours", value: "24h" }, { name: "Last 7 days", value: "7d" }, { name: "Last 10 days", value: "10d" }, { name: "All messages (last 14 days)", value: "all" })),
    async execute(interaction) {
        const isDM = !interaction.guild;
        if (isDM) {
            await interaction.reply({
                content: "This is a Server-Only Command! 🖕",
                flags: 64,
            });
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
            return;
        }
        const member = interaction.member;
        const userRoles = member.roles.cache.map(role => role.id);
        const ownerId = interaction.guild.ownerId;
        const hasModeratorRole = userRoles.includes(Moderator);
        if (interaction.user.id !== ownerId && !hasModeratorRole) {
            await interaction.reply({
                content: "🚫 You do not have permission to use this command!",
                flags: 64,
            });
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
            return;
        }
        const channel = interaction.channel;
        const deleteOption = interaction.options.getString("deletemessages", true);
        let messagesDeleted = 0;
        const now = Date.now();
        let timeLimit = 0;
        switch (deleteOption) {
            case "6h":
                timeLimit = now - 6 * 60 * 60 * 1000;
                break;
            case "24h":
                timeLimit = now - 24 * 60 * 60 * 1000;
                break;
            case "7d":
                timeLimit = now - 7 * 24 * 60 * 60 * 1000;
                break;
            case "10d":
                timeLimit = now - 10 * 24 * 60 * 60 * 1000;
                break;
            case "all":
                timeLimit = now - 14 * 24 * 60 * 60 * 1000;
                break;
            default:
                await interaction.reply({
                    content: "❌ Invalid option selected!",
                    flags: 64,
                });
                return;
        }
        try {
            await interaction.deferReply({ flags: 64 });
            let lastMessageId;
            let messagesDeleted = 0;
            while (true) {
                const fetchOptions = { limit: 100 };
                if (lastMessageId)
                    fetchOptions.before = lastMessageId;
                const messagesFetched = await channel.messages.fetch(fetchOptions);
                if (messagesFetched.size === 0)
                    break;
                const messagesToDelete = messagesFetched.filter(msg => msg.createdTimestamp >= timeLimit);
                if (messagesToDelete.size > 0) {
                    await channel.bulkDelete(messagesToDelete, true);
                    messagesDeleted += messagesToDelete.size;
                }
                lastMessageId = messagesFetched.last()?.id;
                if (messagesFetched.every(msg => msg.createdTimestamp < timeLimit))
                    break;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            if (messagesDeleted === 0) {
                await interaction.editReply({
                    content: "❌ No messages were found within the selected time range!",
                });
            }
            else {
                await interaction.editReply({
                    content: `✅ Successfully deleted **${messagesDeleted}** messages!`,
                });
                const userName = member.displayName || interaction.user.username;
                (0, logger_custom_1.logger_custom)(userName, "purge", `Deleted ${messagesDeleted} messages in #${channel.name} (Range: ${deleteOption})`);
            }
        }
        catch (error) {
            console.error("Error in purge command:", error);
            await interaction.editReply({
                content: "❌ An error occurred while deleting messages!",
            });
        }
    },
};
exports.default = PurgeCommand;
