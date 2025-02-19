import { Message, TextChannel } from "discord.js";

const jobBoardHealthyCards: { position: string; name: string }[] = [];

export default {
    triggers: [".?learn", ".?work"],
    async execute(message: Message) {
        if (!message.reference) return;
        const repliedTo = await message.channel.messages.fetch(message.reference.messageId!);
        if (!repliedTo) return;
        if (!repliedTo.author.bot || repliedTo.author.id !== "646937666251915264") return;

        const embed = repliedTo.embeds[0];
        if (!embed?.description) return;

        if (message.content.startsWith(".?learn")) {
            jobBoardHealthyCards.length = 0;
            const lines = embed.description.split("\n");
            for (const line of lines) {
                const match = line.match(/^(🇦|🇧|🇨|🇩|🇪)\s(.+?)\s·\s\*\*(\d+)\*\*\sEffort\s·\s`(Healthy|Injured)`/);
                if (match) {
                    const [_, position, name, effort, status] = match;
                    if (status === "Healthy") {
                        jobBoardHealthyCards.push({ position, name });
                    }
                }
            }
            const count = jobBoardHealthyCards.length;
            if (count === 5) {
                await message.reply("✅ All cards are already healthy in the Job Board.");
                return;
            }
            const cardText = `✅ I've learned that there ${count === 1 ? "is" : "are"} ${count} healthy ${count === 1 ? "card" : "cards"} in the Job Board.\n Type \`kc o:eff\` and reply your collection with \`.?work\``;
            await message.reply(cardText);
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
                if (jobBoardHealthyCards.some((card) => card.name === name)) continue;
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