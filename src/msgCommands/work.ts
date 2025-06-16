import { Message, TextChannel, AttachmentBuilder, EmbedBuilder } from "discord.js";
import path from "path";
import { BOT_ID } from "../utility/uuid/Bot-ID";
import { AllCardsHealthyEmbed, EmptyJobBoard, NoJobBoardFound, NotTriggeredByYou, NoCardsFound, JobBoardSummary } from "../utility/embeds/karuta-work";
const Karuta = BOT_ID[0].roleId;

const jobBoardHealthyCards: { position: string; name: string }[] = [];

export default {
    triggers: [".?scan", ".?work"],
    async execute(message: Message) {
        if (!message.reference) return;
        const repliedTo = await message.channel.messages.fetch(message.reference.messageId!);
        if (!repliedTo) return;
        if (!repliedTo.author.bot || repliedTo.author.id !== Karuta) return;

        let triggeredByUser: boolean = false;

        if (repliedTo.reference) {
            const originalMessage = await message.channel.messages.fetch(repliedTo.reference.messageId!).catch(() => null);
            if (originalMessage && originalMessage.author.id === message.author.id) {
                triggeredByUser = true;
            }
        }

        if (!triggeredByUser) {
            await message.reply({ embeds: [NotTriggeredByYou()] });
            return;
        }


        const embed = repliedTo.embeds[0];
        if (!embed?.description) return;

        if (message.content.startsWith(".?scan")) {
            jobBoardHealthyCards.length = 0;
            const lines = embed.description.split("\n").map((line) => line.trim()).filter(Boolean);
            let foundJobBoard = false;
            for (const line of lines) {
                const match = line.match(/^(🇦|🇧|🇨|🇩|🇪)\s(.+?)\s·\s\*\*(\d+)\*\*\sEffort\s·\s`(Healthy|Injured)`/);
                if (match) {
                    foundJobBoard = true;
                    const [_, position, name, effort, status] = match;
                    if (status === "Healthy") {
                        jobBoardHealthyCards.push({ position, name });
                    }
                }
            }
            if (!foundJobBoard) {
                const gifPath = path.join(__dirname, "../public/GIF/silly-cat-silly-car.gif");
                const gif = new AttachmentBuilder(gifPath);
                await message.reply({
                    embeds: [NoJobBoardFound()],
                    files: [gif]
                });
                return;
            }
            if (jobBoardHealthyCards.length === 0) {
                const hasCards = lines.some(line => line.match(/^(🇦|🇧|🇨|🇩|🇪)\s(.+?)\s·\s\*\*(\d+)\*\*\sEffort\s·\s`(Injured)`/));
                if (hasCards) { } else {
                    await message.reply({
                        embeds: [EmptyJobBoard()]
                    });
                    return;
                }

            }

            const count = jobBoardHealthyCards.length;
            if (count === 5) {
                await message.reply({ embeds: [AllCardsHealthyEmbed()] });
                return;
            }
            const healthyCount: number = jobBoardHealthyCards.length;
            const injuredCount: number = lines.filter(line => line.match(/^(🇦|🇧|🇨|🇩|🇪)\s(.+?)\s·\s\*\*(\d+)\*\*\sEffort\s·\s`Injured`/)).length;

            await message.reply({embeds: [JobBoardSummary(healthyCount,injuredCount)]});
        }

        if (message.content.startsWith(".?work")) {
            const availableCards = [...embed.description.matchAll(/\*\*`([^`]+)`\*\*.*\*\*(.+?)\*\*$/gm)].map(
                (match) => ({
                    code: match[1],
                    name: match[2].trim(),
                })
            );

            if (availableCards.length === 0) {
                await message.reply({ embeds: [NoCardsFound()]});
                return;
            }

            const allLabels = ["A", "B", "C", "D", "E"];
            const emojiToLabel: Record<string, string> = {
                "🇦": "A",
                "🇧": "B",
                "🇨": "C",
                "🇩": "D",
                "🇪": "E",
            };

            const usedLabels = jobBoardHealthyCards
                .map((card) => emojiToLabel[card.position])
                .filter(Boolean);

            const availableLabels = allLabels.filter((label) => !usedLabels.includes(label));
            let labelIndex = 0;

            for (const { code, name } of availableCards) {
                if (jobBoardHealthyCards.some((card) => name.startsWith(card.name))) continue;
                if (labelIndex >= availableLabels.length) break;
                const label = availableLabels[labelIndex];
                labelIndex++;

                if (message.channel.isTextBased()) {
                    await (message.channel as TextChannel).send(`kjw ${label.toLowerCase()} ${code}`);
                }
            }


            if (labelIndex === 0) {

                await message.reply({ embeds: [AllCardsHealthyEmbed()] });
            }
        }
    },
};