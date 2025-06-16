"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const utils_1 = require("../utility/utils");
const Colors_1 = require("../utility/uuid/Colors");
exports.default = {
    triggers: [".?prince-kun", ".?bot"],
    async execute(message) {
        if (!message.member?.permissions.has(discord_js_1.PermissionsBitField.Flags.Administrator)) {
            return message
                .reply("⛔ You must be the server owner to use this command!")
                .then((msg) => {
                setTimeout(() => msg.delete().catch(() => { }), 5000);
            });
        }
        ;
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.COLOR_PRIMARY)
            .setAuthor({
            name: "Prince-Kun • Prince-Kun",
            iconURL: utils_1.ProfileAuthorPicture
        })
            .setTitle("Invite 'Prince-kun' Bot in your Server")
            .setDescription(`You can invite my bot in your server! 🌟🌻\n\n` +
            `**Shareable Link:** ${utils_1.DiscordBotInviteLinkShort}\n\n` +
            `[Click Here To Invite!](${utils_1.DiscordBotInviteLink})`)
            .setImage(utils_1.DiscordBotInvite)
            .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId("copy_link")
            .setLabel("Copy Link")
            .setStyle(discord_js_1.ButtonStyle.Secondary)
            .setEmoji("📋"));
        const sentMessage = await message.reply({ embeds: [embed], components: [row] });
        const collector = sentMessage.createMessageComponentCollector({
            time: 60000,
        });
        collector.on("collect", async (interaction) => {
            if (interaction.customId === "copy_link") {
                if (interaction.user.id !== message.author.id) {
                    return interaction.reply({
                        content: "❌ Only the command sender can use this button!",
                        flags: 64,
                    });
                }
                await interaction.reply({
                    content: `${utils_1.DiscordBotInviteLink}`,
                    flags: 64,
                });
            }
        });
        collector.on("end", () => {
            sentMessage.edit({ components: [] }).catch(() => { });
        });
    },
};
