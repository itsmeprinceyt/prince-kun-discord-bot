import { Message, TextChannel, AttachmentBuilder } from "discord.js";
import path from "path";
import { BOT_ID } from "../utility/botId";
const Karuta = BOT_ID[0].roleId;

const jobBoardHealthyCards: { position: string; name: string }[] = [];

export default {
    triggers: [".?scan", ".?work"],
    async execute(message: Message) {
        if (!message.reference) return;
        const repliedTo = await message.channel.messages.fetch(message.reference.messageId!);
        if (!repliedTo) return;
        if (!repliedTo.author.bot || repliedTo.author.id !== Karuta) return;

        let triggeredByUser = false;

        if (repliedTo.reference) {
            const originalMessage = await message.channel.messages.fetch(repliedTo.reference.messageId!).catch(() => null);
            if (originalMessage && originalMessage.author.id === message.author.id) {
                triggeredByUser = true;
            }
        }

        if (!triggeredByUser) {
            await message.reply("⚠️ You can only use the command on the embed message triggered by you.");
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
                    content: "⚠️ No Job Board found. Make sure you're replying to the correct embed.",
                    files: [gif]
                });
                return;
            }
            if (jobBoardHealthyCards.length === 0) {
                const hasCards = lines.some(line => line.match(/^(🇦|🇧|🇨|🇩|🇪)\s(.+?)\s·\s\*\*(\d+)\*\*\sEffort\s·\s`(Injured)`/));
                if (hasCards) { } else {
                    await message.reply("⚠️ The Job Board appears to be empty or no valid cards were found.");
                    return;
                }

            }

            const count = jobBoardHealthyCards.length;
            if (count === 5) {
                await message.reply("✅ All cards are already healthy in the Job Board.");
                return;
            }
            const healthyCount = jobBoardHealthyCards.length;
            const injuredCount = lines.filter(line => line.match(/^(🇦|🇧|🇨|🇩|🇪)\s(.+?)\s·\s\*\*(\d+)\*\*\sEffort\s·\s`Injured`/)).length;

            const cardText = `✅ I've learned that there ${healthyCount === 1 ? "is" : "are"} ${healthyCount} healthy ${healthyCount === 1 ? "card" : "cards"} and ${injuredCount} injured ${injuredCount === 1 ? "card" : "cards"} in the Job Board.\n Type \`kc o:eff\` and reply your collection with \`.?work\`\n`;
            await message.reply(cardText + `-# This command will not run as expected if you have any card's alias setup.`);

        }

        if (message.content.startsWith(".?work")) {
            const availableCards = [...embed.description.matchAll(/\*\*`([^`]+)`\*\*.*\*\*(.+?)\*\*$/gm)].map(
                (match) => ({
                    code: match[1],
                    name: match[2].trim(),
                })
            );

            if (availableCards.length === 0) {
                await message.reply("⚠️ No card codes found in kc o:eff.");
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
                await message.reply("✅ All cards are already healthy in the Job Board.");
            }
        }
    },
};