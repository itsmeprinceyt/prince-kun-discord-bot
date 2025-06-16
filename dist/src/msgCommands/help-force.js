"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const help_commands_1 = require("../utility/commands/help/help-commands");
const utils_1 = require("../utility/utils");
const Colors_1 = require("../utility/uuid/Colors");
exports.default = {
    triggers: [".?help-force"],
    async execute(message) {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_PRIMARY)
            .setAuthor({
            name: "Prince-Kun • Commands",
            iconURL: utils_1.ProfileAuthorPicture,
        })
            .setTitle("Here are all the available commands which you can use!")
            .setDescription(help_commands_1.HelpDescription)
            .setImage(utils_1.Help)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();
        if (!message.guild) {
            await message.reply({ embeds: [embed] });
            return;
        }
        if (message.author.id !== message.guild.ownerId) {
            await message
                .reply("⛔ You must be the server owner to use this command!")
                .then((msg) => {
                setTimeout(() => msg.delete().catch(() => { }), 5000);
            });
            return;
        }
        await message.reply({ embeds: [embed] });
    },
};
