"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
exports.default = {
    triggers: [".?artwork"],
    async execute(message) {
        const logoPath = path_1.default.join(__dirname, "../public/DiscordBotLogo.png");
        if (!fs_1.default.existsSync(logoPath)) {
            return message.reply("The artwork image could not be found.");
        }
        const attachment = new discord_js_1.AttachmentBuilder(logoPath, { name: "DiscordBotLogo.png" });
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
            name: "Prince-Kun • Artwork",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
            .setTitle("Artwork Credit")
            .setDescription(`A huge thank you to <@793154222806925333> for creating this amazing artwork for the Prince-Kun! If you're looking for fantastic artwork commissions, be it anime-related or chibi related then make sure to reach out to them!`)
            .setImage("attachment://DiscordBotLogo.png")
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();
        await message.reply({ embeds: [embed], files: [attachment] });
    },
};
