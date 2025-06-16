"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const help_commands_1 = require("../utility/commands/help/help-commands");
const Colors_1 = require("../utility/uuid/Colors");
const utils_1 = require("../utility/utils");
const HelpCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("help")
        .setDescription("Get a list of all available commands."),
    async execute(interaction) {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_PRIMARY)
            .setAuthor({
            name: "Prince-Kun • Commands",
            iconURL: utils_1.ProfileAuthorPicture,
        })
            .setTitle("Here are all the available commands you can use!")
            .setDescription(help_commands_1.HelpDescription)
            .setImage(utils_1.Help)
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();
        try {
            await interaction.deferReply({ flags: 64 });
            await interaction.user.send({ embeds: [embed] });
            await interaction.editReply({
                content: "📩 I've sent you a DM with all the available commands!",
            });
        }
        catch (error) {
            console.error("Failed to send DM:", error);
            await interaction.editReply({
                content: "⚠️ I couldn't send you a DM! Please check your privacy settings.",
            });
        }
    }
};
exports.default = HelpCommand;
