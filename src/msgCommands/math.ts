import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { evaluate, sqrt } from "mathjs";

export default {
    triggers: [".?math"],
    async execute(message: Message) {
        if (!message.content.startsWith(".?math")) return;
        let expression = message.content.slice(6).trim();

        if (!expression) {
            return message.reply("❌ Please provide a mathematical expression to evaluate.");
        }

        expression = expression
            .replace(/[x×﹡＊·‧]/g, "*")
            .replace(/√(\d+(\.\d+)?)/g, "sqrt($1)")
            .replace(/\^/g, "**")
            .replace(/(\d)\(/g, "$1*(");

        try {
            let answer = evaluate(expression);

            if (answer === undefined || answer === null || isNaN(answer)) {
                return message.reply("❌ Invalid mathematical expression.");
            }

            let formattedAnswer: string;

            if (answer.toString().includes("e")) {
                formattedAnswer = answer.toFixed(10).replace(/\.?0+$/, "");
            } else {
                formattedAnswer = Number.isInteger(answer) ? answer.toString() : answer.toFixed(2);
            }

            if (formattedAnswer.length > 50) {
                formattedAnswer = parseFloat(answer).toExponential(10);
            }

            const embed = new EmbedBuilder()
                .setColor(0xc200ff)
                .setAuthor({
                    name: "Prince-Kun • Math",
                    iconURL:
                        "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
                })
                .setTitle(`Result: ${formattedAnswer}`)
                .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            const copyButton = new ButtonBuilder()
                .setCustomId("copy_answer")
                .setLabel("Copy Answer")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("📋");

            const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(copyButton);

            const sentMessage = await message.reply({
                embeds: [embed],
                components: [actionRow],
            });

            const collector = sentMessage.createMessageComponentCollector({
                time: 60000,
            });

            collector.on("collect", async (interaction) => {
                if (interaction.customId !== "copy_answer") return;

                if (interaction.user.id !== message.author.id) {
                    return interaction.reply({
                        content: "❌ Only the command sender can use this button!",
                        flags: 64,
                    });
                }

                await interaction.reply({
                    content: `${formattedAnswer}`,
                    flags: 64,
                });
            });

            collector.on("end", () => {
                sentMessage.edit({ components: [] }).catch(() => {});
            });

        } catch (error) {
            await message.reply("❌ Invalid mathematical expression.");
        }
    },
};
