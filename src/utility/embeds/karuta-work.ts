import { EmbedBuilder } from "discord.js";
import { COLOR_TRUE, GOLDEN_EMBED } from "../uuid/Colors";

export function AllCardsHealthyEmbed(): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(COLOR_TRUE)
        .setDescription("✅ All cards are already healthy in your Job Board.");
}

export function JobBoardSummary(healthyCount: number, injuredCount: number): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(COLOR_TRUE)
        .setDescription(`Hey, so I've learned that you currently have ...\n\n✅ **Healthy ${healthyCount >=2 ? 'Cards': 'Card'}:** ${healthyCount}\n❌ **Injured ${injuredCount >=2 ? 'Cards': 'Card'}:** ${injuredCount}\n\nType \`kc o:eff\` and reply your collection with \`.?work\`\n-# This will not work with the cards you have alias.`)
        .setTimestamp()
}

export function NotTriggeredByYou(): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(GOLDEN_EMBED)
        .setDescription("⚠️ You can only use the command on the embed message triggered by you.")
}

export function NoJobBoardFound(): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(GOLDEN_EMBED)
        .setDescription("⚠️ No Job Board found. Make sure you're replying to the correct embed.")
}

export function EmptyJobBoard(): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(GOLDEN_EMBED)
        .setDescription("⚠️ The Job Board appears to be empty or no valid cards were found.")
}

export function NoCardsFound(): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(GOLDEN_EMBED)
        .setDescription("⚠️ No card codes found in kc o:eff.")
}