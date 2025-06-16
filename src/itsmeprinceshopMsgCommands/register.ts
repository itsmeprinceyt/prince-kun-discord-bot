import { Message, EmbedBuilder, TextChannel } from "discord.js";
import moment from "moment-timezone";
import pool from "../db";
import { logger_custom } from "../utility/loggers/logger-custom";
import { ItsMePrinceRules } from "../utility/commands/rules/itsmeprince-rules";
import { getRegistrationSuccessEmbed } from '../utility/embeds/register-done';
import { COLOR_PRIMARY } from "../utility/uuid/Colors";
import { ProfileAuthorPicture } from "../utility/utils";

const registerCommand = {
    triggers: [".?register"],
    async execute(message: Message) {
        if (!message.guild) {
            return message.reply("You can only use \`/register\` in DM");
        }

        const userId = message.author.id;
        const userName = message.member?.displayName || message.author.username;

        const [rows]: any = await pool.query("SELECT user_id FROM users WHERE user_id = ?", [userId]);

        if (rows.length > 0) {
            return message.reply("❌ You are already registered!");
        }

        const embed1 = new EmbedBuilder()
            .setColor(COLOR_PRIMARY)
            .setAuthor({
                name: "Prince-Kun • ItsMe Prince Shop",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle("ItsMe Prince Shop - Profile Registration")
            .setThumbnail(message.author.displayAvatarURL())
            .setDescription(
                ItsMePrinceRules +
                `\n**You accept the rules by registering and you also agree to any future updates or changes in the value of PP CASH. It is your responsibility to stay updated with the latest rules.**`);

        const embed2 = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Registration Instructions")
            .setDescription(
                `To register, type: \`.?confirm\`\nTo cancel, type: \`.?cancel\``
            )
            .setFooter({ text: `${userName}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();
        await (message.channel as any).send({ embeds: [embed1, embed2] });

        const filter = (msg: Message) =>
            msg.author.id === userId &&
            [".?confirm", ".?cancel"].includes(msg.content.toLowerCase());

        if (message.channel && message.channel.isTextBased()) {
            const textChannel = message.channel as TextChannel;
            const collector = textChannel.createMessageCollector({ filter, time: 30000 });

            collector.on("collect", async (msg) => {
                if (msg.content.toLowerCase() === ".?confirm") {
                } else if (msg.content.toLowerCase() === ".?cancel") {
                    await (msg.channel as any).send("Registration cancelled.");
                    collector.stop();
                }
            });

            collector.on("collect", async (msg: any) => {
                if (msg.content.toLowerCase() === ".?confirm") {
                    const istTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

                    await pool.query(
                        "INSERT INTO users (user_id, pp_cash, refer_tickets, total_purchases, registration_date, total_referred) VALUES (?, ?, ?, ?, ?, ?)",
                        [userId, 0, 0, 0, istTime, 0]
                    );

                    const logMessage = `[ DATABASE ] User ${userName} (${userId}) registered`;
                    logger_custom(userName, "register", logMessage);

                    await msg.channel.send({
                        embeds: [getRegistrationSuccessEmbed(message.author)],
                    });

                    collector.stop();
                }
            });
            collector.on("end", async (_, reason) => {
                if (reason === "time") {
                    await (message.channel as any).send("Registration timed out. Please use `.?register` again if you want to register.");
                }
            });
        } else {
            return message.reply("I can't collect messages in this type of channel.");
        }
    }
};

export default registerCommand;
