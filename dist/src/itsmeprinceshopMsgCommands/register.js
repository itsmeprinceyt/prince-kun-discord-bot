"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const db_1 = __importDefault(require("../db"));
const logger_custom_1 = require("../utility/loggers/logger-custom");
const itsmeprince_rules_1 = require("../utility/commands/rules/itsmeprince-rules");
const register_done_1 = require("../utility/embeds/register-done");
const Colors_1 = require("../utility/uuid/Colors");
const utils_1 = require("../utility/utils");
const registerCommand = {
    triggers: [".?register"],
    async execute(message) {
        if (!message.guild) {
            return message.reply("You can only use \`/register\` in DM");
        }
        const userId = message.author.id;
        const userName = message.member?.displayName || message.author.username;
        const [rows] = await db_1.default.query("SELECT user_id FROM users WHERE user_id = ?", [userId]);
        if (rows.length > 0) {
            return message.reply("❌ You are already registered!");
        }
        const embed1 = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_PRIMARY)
            .setAuthor({
            name: "Prince-Kun • ItsMe Prince Shop",
            iconURL: utils_1.ProfileAuthorPicture,
        })
            .setTitle("ItsMe Prince Shop - Profile Registration")
            .setThumbnail(message.author.displayAvatarURL())
            .setDescription(itsmeprince_rules_1.ItsMePrinceRules +
            `\n**You accept the rules by registering and you also agree to any future updates or changes in the value of PP CASH. It is your responsibility to stay updated with the latest rules.**`);
        const embed2 = new discord_js_1.EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Registration Instructions")
            .setDescription(`To register, type: \`.?confirm\`\nTo cancel, type: \`.?cancel\``)
            .setFooter({ text: `${userName}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();
        await message.channel.send({ embeds: [embed1, embed2] });
        const filter = (msg) => msg.author.id === userId &&
            [".?confirm", ".?cancel"].includes(msg.content.toLowerCase());
        if (message.channel && message.channel.isTextBased()) {
            const textChannel = message.channel;
            const collector = textChannel.createMessageCollector({ filter, time: 30000 });
            collector.on("collect", async (msg) => {
                if (msg.content.toLowerCase() === ".?confirm") {
                }
                else if (msg.content.toLowerCase() === ".?cancel") {
                    await msg.channel.send("Registration cancelled.");
                    collector.stop();
                }
            });
            collector.on("collect", async (msg) => {
                if (msg.content.toLowerCase() === ".?confirm") {
                    const istTime = (0, moment_timezone_1.default)().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
                    await db_1.default.query("INSERT INTO users (user_id, pp_cash, refer_tickets, total_purchases, registration_date, total_referred) VALUES (?, ?, ?, ?, ?, ?)", [userId, 0, 0, 0, istTime, 0]);
                    const logMessage = `[ DATABASE ] User ${userName} (${userId}) registered`;
                    (0, logger_custom_1.logger_custom)(userName, "register", logMessage);
                    await msg.channel.send({
                        embeds: [(0, register_done_1.getRegistrationSuccessEmbed)(message.author)],
                    });
                    collector.stop();
                }
            });
            collector.on("end", async (_, reason) => {
                if (reason === "time") {
                    await message.channel.send("Registration timed out. Please use `.?register` again if you want to register.");
                }
            });
        }
        else {
            return message.reply("I can't collect messages in this type of channel.");
        }
    }
};
exports.default = registerCommand;
