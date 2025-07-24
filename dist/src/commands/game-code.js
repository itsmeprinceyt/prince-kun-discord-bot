"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_NoDM_NoAdmin_1 = require("../utility/loggers/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/loggers/logger-custom");
const PingRoles_1 = require("../utility/uuid/PingRoles");
const RolesPerms_1 = require("../utility/uuid/RolesPerms");
const utils_1 = require("../utility/utils");
const Colors_1 = require("../utility/uuid/Colors");
const ReactionEmotes_1 = require("../utility/uuid/ReactionEmotes");
const GenshinPing = PingRoles_1.PING_Roles[1].roleId;
const HSRPing = PingRoles_1.PING_Roles[2].roleId;
const WuwaPing = PingRoles_1.PING_Roles[3].roleId;
const ZZZPing = PingRoles_1.PING_Roles[6].roleId;
const CodePoster = RolesPerms_1.RolesPerms[0].roleId;
const userCache = new Map();
const GameCode = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("game-code")
        .setDescription("Sends an embed about a game's redemption code.")
        .addStringOption((option) => option.setName("game")
        .setDescription("Select game")
        .setRequired(true)
        .addChoices({ name: "Genshin Impact", value: "genshin" }, { name: "Honkai Star Rail", value: "hsr" }, { name: "Wuthering Waves", value: "wuwa" }, { name: "Zenless Zone Zero", value: "zzz" }))
        .addStringOption(option => option.setName("redemption_code")
        .setDescription("Enter the redemption code")
        .setRequired(true))
        .addStringOption(option => option.setName("code_title")
        .setDescription("Enter the title for this code/what are the rewards?")
        .setRequired(true))
        .addBooleanOption(option => option.setName("usedefaultimage")
        .setDescription("Use the default image? Select No if you have customImageUrl")
        .setRequired(true))
        .addStringOption(option => option.setName("custom_image_url")
        .setDescription("Enter a custom image URL")
        .setRequired(false)),
    async execute(interaction) {
        const isDM = !interaction.guild;
        if (isDM) {
            await interaction.reply({
                content: "This is a Server-Only Command! 🖕",
                flags: 64,
            });
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
            return;
        }
        const member = interaction.member;
        const userRoles = member.roles.cache.map(role => role.id);
        const ownerId = interaction.guild.ownerId;
        const hasRequiredRole = userRoles.includes(CodePoster);
        if (interaction.user.id !== ownerId && !hasRequiredRole) {
            await interaction.reply({
                content: "🚫 Only the server owner or users with the required role can use this command!",
                flags: 64,
            });
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
            return;
        }
        userCache.set(interaction.user.id, {
            username: interaction.user.username,
            avatarURL: interaction.user.displayAvatarURL(),
        });
        const userInfo = userCache.get(interaction.user.id);
        const username = userInfo?.username || interaction.user.username;
        const avatarURL = userInfo?.avatarURL || interaction.user.displayAvatarURL();
        const game = interaction.options.getString("game", true);
        const redemptionCode = interaction.options.getString("redemption_code", true);
        const codeTitle = interaction.options.getString("code_title", true);
        const useDefaultImage = interaction.options.getBoolean("usedefaultimage", true);
        const customImageUrl = interaction.options.getString("custom_image_url")?.trim() || null;
        const sanitizedImageUrl = customImageUrl ? customImageUrl.replace(/\?.*$/, "") : null;
        let imageUrl = "";
        if (game === "genshin" && useDefaultImage) {
            imageUrl = utils_1.DefaultImageGenshin;
        }
        else if (game === "hsr" && useDefaultImage) {
            imageUrl = utils_1.DefaultImageHSR;
        }
        else if (game === "wuwa" && useDefaultImage) {
            imageUrl = utils_1.DefaultImageWuwa;
        }
        else if (game === "zzz" && useDefaultImage) {
            imageUrl = utils_1.DefaultImageZZZ;
        }
        else if (!useDefaultImage && sanitizedImageUrl) {
            imageUrl = sanitizedImageUrl;
        }
        else {
            await interaction.reply({
                content: "❌ Please provide a custom image URL if not using the default image!",
                flags: 64,
            });
            return;
        }
        /*=================================================== GENSHIN IMPACT*/
        const genshinPing = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.BLUE_EMBED)
            .setAuthor({
            name: "Prince-Kun • Genshin Impact",
            iconURL: utils_1.ProfileAuthorPicture,
        })
            .setTitle(`${codeTitle}`)
            .setDescription(`Code: [${redemptionCode}](https://genshin.hoyoverse.com/en/gift?code=${redemptionCode})\n\n` +
            `Click on the code above or redeem through the website below:\n https://genshin.hoyoverse.com/en/gift`)
            .setImage(imageUrl)
            .setFooter({ text: `${username}`, iconURL: avatarURL })
            .setTimestamp();
        /*=================================================== HONKAI STAR RAIL*/
        const hsrPing = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.BLUE_EMBED)
            .setAuthor({
            name: "Prince-Kun • Honkai Star Rail",
            iconURL: utils_1.ProfileAuthorPicture,
        })
            .setTitle(`${codeTitle}`)
            .setDescription(`Code: [${redemptionCode}](https://hsr.hoyoverse.com/gift?code=${redemptionCode})\n\n` +
            `Click on the code above or redeem through the website below:\n https://hsr.hoyoverse.com/gift`)
            .setImage(imageUrl)
            .setFooter({ text: `${username}`, iconURL: avatarURL })
            .setTimestamp();
        /*=================================================== WUTHERING WAVES*/
        const wuwaPing = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.BLUE_EMBED)
            .setAuthor({
            name: "Prince-Kun • Wuthering Waves",
            iconURL: utils_1.ProfileAuthorPicture,
        })
            .setTitle(`${codeTitle}`)
            .setDescription(`Code: ${redemptionCode}\n\n` +
            `There is no official website to redeem codes, you need to log-into your game to be able to redeem the code!`)
            .setImage(imageUrl)
            .setFooter({ text: `${username}`, iconURL: avatarURL })
            .setTimestamp();
        /*=================================================== ZENLESS ZONE ZERO*/
        const zzzPing = new discord_js_1.EmbedBuilder()
            .setColor(Colors_1.ORANGE_EMBED)
            .setAuthor({
            name: "Prince-Kun • Zenless Zone Zero",
            iconURL: utils_1.ProfileAuthorPicture,
        })
            .setTitle(`${codeTitle}`)
            .setDescription(`Code: [${redemptionCode}](https://zenless.hoyoverse.com/redemption?code=${redemptionCode})\n\n` +
            `Click on the code above or redeem through the website below:\n https://zenless.hoyoverse.com/redemption`)
            .setImage(imageUrl)
            .setFooter({ text: `${username}`, iconURL: avatarURL })
            .setTimestamp();
        const embedsMap = {
            "genshin": [genshinPing],
            "hsr": [hsrPing],
            "wuwa": [wuwaPing],
            "zzz": [zzzPing],
        };
        const gameRoles = {
            "genshin": GenshinPing,
            "hsr": HSRPing,
            "wuwa": WuwaPing,
            "zzz": ZZZPing,
        };
        const roleToPing = gameRoles[game] || "";
        const embedsToSend = embedsMap[game];
        const channel = interaction.channel;
        if (embedsToSend) {
            const sentMessage = await channel.send({
                content: roleToPing ? `<@&${roleToPing}>` : "",
                embeds: embedsToSend,
            });
            const emojiToReact = ReactionEmotes_1.GameCurrencyEmotes[game];
            if (emojiToReact) {
                const emojiMatch = emojiToReact.match(/<:\w+:(\d+)>/);
                if (emojiMatch) {
                    const emojiId = emojiMatch[1];
                    try {
                        await sentMessage.react(emojiId);
                    }
                    catch {
                        await sentMessage.react(ReactionEmotes_1.FallbackReaction);
                    }
                }
            }
            await interaction.reply({
                content: "✅ Redemption Code Sent!!",
                flags: 64,
            });
            const MessageString = `Command executed successfully! : Game: "${game}", Code: "${redemptionCode}" sent!`;
            (0, logger_custom_1.logger_custom)(username, "game-code", MessageString);
        }
    }
};
exports.default = GameCode;
