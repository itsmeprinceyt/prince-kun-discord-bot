import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    TextChannel,
    Client,
} from "discord.js";

import { Command } from "../types/Command.type";
import { logger_NoDM_NoAdmin } from "../utility/loggers/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/loggers/logger-custom";
import { TextChannels } from "../utility/uuid/TextChannels";
import { RolesPerms } from "../utility/uuid/RolesPerms";

const PREDEFINED_SERVER_ID = "310675536340844544";
const HIGHLIGHT_CHANNEL_ID = TextChannels[0].roleId;
const adminId = RolesPerms[5].roleId;

const newHighlight: Command = {
    data: new SlashCommandBuilder()
        .setName("new-highlight")
        .setDescription("Sends a new highlight image.")
        .addStringOption(option =>
            option.setName("image-url")
                .setDescription("Paste the image URL here.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("text")
                .setDescription("Optional text message to send before the image.")
                .setRequired(false)
        ) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        const isDM = !interaction.guild;
        let guild = interaction.guild;

        if (isDM) {
            if (interaction.user.id !== adminId) {
                await interaction.reply({
                    content: "This is a Server-Only Command! 🖕",
                    flags: 64
                });
                logger_NoDM_NoAdmin(interaction);
                return;
            }

            const client = interaction.client as Client;
            guild = client.guilds.cache.get(PREDEFINED_SERVER_ID) || null;

            if (!guild) {
                await interaction.reply({
                    content: "❌ Could not find the predefined server!",
                    flags: 64,
                });
                return;
            }
        } else {
            if (interaction.user.id !== interaction.guild.ownerId) {
                await interaction.reply({
                    content: "🚫 You do not have permission to use this command!",
                    flags: 64
                });
                logger_NoDM_NoAdmin(interaction);
                return;
            }
        }

        const highlightChannel = guild?.channels.cache.get(HIGHLIGHT_CHANNEL_ID) as TextChannel;

        if (!highlightChannel) {
            await interaction.reply({
                content: "❌ Highlight channel not found!",
                flags: 64,
            });
            return;
        }

        const imageUrl: string = interaction.options.getString("image-url", true).trim();
        const sanitizedImageUrl: string = imageUrl.replace(/\?.*$/, "");
        const textMessage: string | undefined = interaction.options.getString("text")?.trim();

        if (textMessage) {
            await highlightChannel.send(textMessage);
        }
        
        await highlightChannel.send(sanitizedImageUrl);

        await interaction.reply({
            content: `✅ Image URL sent to the highlight channel! Check: <#${HIGHLIGHT_CHANNEL_ID}>`,
            flags: 64,
        });
        
        logger_custom(interaction.user.username, "image-url", `new highlight image sent to ${HIGHLIGHT_CHANNEL_ID}: ${sanitizedImageUrl}`);
    }
}

export default newHighlight;
