"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../utility/utils");
const Colors_1 = require("../utility/uuid/Colors");
exports.default = {
    triggers: [".?artwork"],
    async execute(message) {
        const logoPath = path_1.default.join(__dirname, utils_1.DiscordBotProfilePictureLocal);
        if (!fs_1.default.existsSync(logoPath)) {
            return message.reply("The artwork image could not be found.");
        }
        const attachment = new discord_js_1.AttachmentBuilder(logoPath, { name: utils_1.DiscordBotProfilePictureLocalName });
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_PRIMARY)
            .setAuthor({
            name: "Prince-Kun • Artwork",
            iconURL: utils_1.ProfileAuthorPicture,
        })
            .setTitle("Artwork Credit")
            .setDescription(`A huge thank you to <@793154222806925333> for creating this amazing artwork for the Prince-Kun! If you're looking for fantastic artwork commissions, be it anime-related or chibi related then make sure to reach out to them!`)
            .setImage(`attachment://${utils_1.DiscordBotProfilePictureLocalName}`)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();
        await message.reply({
            embeds: [embed],
            files: [attachment],
        });
    },
};
