"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const help_commands_1 = require("../utility/commands/help/help-commands");
const utils_1 = require("../utility/utils");
exports.default = {
    triggers: [".?help"],
    async execute(message) {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
            name: "Prince-Kun • Commands",
            iconURL: utils_1.ProfileAuthorPicture,
        })
            .setTitle("Here are all the available commands which you can use!")
            .setDescription(help_commands_1.HelpDescription)
            .setImage(utils_1.Help)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();
        try {
            await message.author.send({ embeds: [embed] });
            if (message.guild) {
                await message.reply({
                    content: "📩 I've sent you a DM with all the available commands!",
                });
            }
        }
        catch (error) {
            console.error("Failed to send DM:", error);
            if (message.guild) {
                await message.reply({
                    content: "⚠️ I couldn't send you a DM! Please check your privacy settings.",
                });
            }
        }
    },
};
