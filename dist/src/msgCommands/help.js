"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const help_commands_1 = require("../utility/help-commands");
exports.default = {
    triggers: [".?help"],
    async execute(message) {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
            name: "Prince-Kun • Commands",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
            .setTitle("Here are all the available commands which you can use!")
            .setDescription(help_commands_1.HelpDescription)
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1336708310904340572/Help.png")
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
