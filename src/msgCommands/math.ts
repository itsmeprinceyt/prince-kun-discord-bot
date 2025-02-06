import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { evaluate } from "mathjs";

export default {
    triggers: [".?math"],
    async execute(message: Message) {
        console.log("Command triggered:", message.content);

        if (!message.content.startsWith(".?math")) {
            console.log("Command doesn't start with .?math");
            return;
        }

        const expression = message.content.slice(6).trim();
        console.log("Extracted expression:", expression);

        if (!expression) {
            console.log("No expression provided.");
            return message.reply("❌ Please provide a mathematical expression to evaluate.");
        }

        const sanitizedExpression = expression.replace(/[^0-9+\-*/().\s]/g, "");
        console.log("Sanitized expression:", sanitizedExpression);

        if (!sanitizedExpression) {
            console.log("Sanitized expression is empty.");
            return message.reply("❌ Invalid mathematical expression.");
        }

        try {
            console.log("Evaluating expression:", sanitizedExpression);

            const answer = evaluate(sanitizedExpression);
            console.log("Evaluation result:", answer);

            if (answer === undefined || answer === null) {
                console.log("Invalid result from evaluation.");
                return message.reply("❌ Invalid mathematical expression.");
            }

            const embed = new EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
                name: "Prince-Kun • Math",
                iconURL:
                    "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("Math Expression")
            .setDescription(
                `
                **Your Input:** ${sanitizedExpression}
                **Result:** ${answer}
                `
            )
            .setImage(
                "https://media.discordapp.net/attachments/1336322293437038602/1337078599219675167/Math.png"
            )
            .setFooter({
                text: `${message.author.username} | ${new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
                iconURL: message.author.displayAvatarURL(),
            });

            const copyButton = new ButtonBuilder()
                .setCustomId("copy_answer")
                .setLabel("Copy Answer")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("📋");;

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
                    content: `${answer}`,
                    flags: 64,
                });
            });

            collector.on("end", () => {
                sentMessage.edit({ components: [] }).catch(() => {});
            });

        } catch (error) {
            console.error("Error during evaluation:", error);
            await message.reply("❌ Invalid mathematical expression.");
        }
    },
};
