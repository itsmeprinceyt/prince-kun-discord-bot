"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_NoDM_NoAdmin_1 = require("../utility/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/logger-custom");
const roles_1 = require("../utility/roles");
const rolePerms_1 = require("../utility/rolePerms");
const GenshinPing = roles_1.Roles[1].roleId;
const HSRPing = roles_1.Roles[2].roleId;
const WuwaPing = roles_1.Roles[3].roleId;
const CodePoster = rolePerms_1.RolesPerms[0].roleId;
const DefaultImageGenshin = "https://media.discordapp.net/attachments/1336322293437038602/1337338720189284352/Primogems.png";
const DefaultImageHSR = "https://media.discordapp.net/attachments/1336322293437038602/1337338704288677949/Jade.png";
const DefaultImageWuwa = "https://media.discordapp.net/attachments/1336322293437038602/1337338722097692682/Astrite.png";
const userCache = new Map();
const GameLivestreamCode = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("game-livestream-codes")
        .setDescription("Sends an embed about a game's special livestream redemption codes.")
        .addStringOption((option) => option.setName("game")
        .setDescription("Select game")
        .setRequired(true)
        .addChoices({ name: "Genshin Impact", value: "genshin" }, { name: "Honkai Star Rail", value: "hsr" }, { name: "Wuthering Waves", value: "wuwa" }))
        .addStringOption(option => option.setName("redemption_code_1")
        .setDescription("Enter the first redemption code")
        .setRequired(true))
        .addStringOption(option => option.setName("redemption_code_2")
        .setDescription("Enter the second redemption code")
        .setRequired(true))
        .addStringOption(option => option.setName("redemption_code_3")
        .setDescription("Enter the third redemption code")
        .setRequired(true))
        .addStringOption(option => option.setName("code_title")
        .setDescription("Enter the title for these codes?")
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
        const userName = member?.displayName || interaction.user.username;
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
        const redemptionCode1 = interaction.options.getString("redemption_code_1", true);
        const redemptionCode2 = interaction.options.getString("redemption_code_2", true);
        const redemptionCode3 = interaction.options.getString("redemption_code_3", true);
        const codeTitle = interaction.options.getString("code_title", true);
        const useDefaultImage = interaction.options.getBoolean("usedefaultimage", true);
        const customImageUrl = interaction.options.getString("custom_image_url")?.trim() || null;
        const sanitizedImageUrl = customImageUrl ? customImageUrl.replace(/\?.*$/, "") : null;
        let imageUrl = "";
        if (game === "genshin" && useDefaultImage) {
            imageUrl = DefaultImageGenshin;
        }
        else if (game === "hsr" && useDefaultImage) {
            imageUrl = DefaultImageHSR;
        }
        else if (game === "wuwa" && useDefaultImage) {
            imageUrl = DefaultImageWuwa;
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
            .setColor(0x006eff)
            .setAuthor({
            name: "Prince-Kun • Genshin Impact",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
            .setTitle(`${codeTitle}`)
            .setDescription(`Code: [${redemptionCode1}](https://genshin.hoyoverse.com/en/gift?code=${redemptionCode1})\n` +
            `Code: [${redemptionCode2}](https://genshin.hoyoverse.com/en/gift?code=${redemptionCode2})\n` +
            `Code: [${redemptionCode3}](https://genshin.hoyoverse.com/en/gift?code=${redemptionCode3})\n\n` +
            `Click on the code above or redeem through the website below:\n https://genshin.hoyoverse.com/en/gift`)
            .setImage(imageUrl)
            .setFooter({ text: `${username}`, iconURL: avatarURL })
            .setTimestamp();
        /*=================================================== EXPRESS PASS*/
        const hsrPing = new discord_js_1.EmbedBuilder()
            .setColor(0x006eff)
            .setAuthor({
            name: "Prince-Kun • Honkai Star Rail",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
            .setTitle(`${codeTitle}`)
            .setDescription(`Code: [${redemptionCode1}](https://hsr.hoyoverse.com/gift?code=${redemptionCode1})\n` +
            `Code: [${redemptionCode2}](https://hsr.hoyoverse.com/gift?code=${redemptionCode2})\n` +
            `Code: [${redemptionCode3}](https://hsr.hoyoverse.com/gift?code=${redemptionCode3})\n\n` +
            `Click on the code above or redeem through the website below:\n https://hsr.hoyoverse.com/gift`)
            .setImage(imageUrl)
            .setFooter({ text: `${username}`, iconURL: avatarURL })
            .setTimestamp();
        /*=================================================== LUNITE SUBSCRIPTION*/
        const wuwaPing = new discord_js_1.EmbedBuilder()
            .setColor(0x006eff)
            .setAuthor({
            name: "Prince-Kun • Wuthering Waves",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
            .setTitle(`${codeTitle}`)
            .setDescription(`Code: ${redemptionCode1}\n` +
            `Code: ${redemptionCode2}\n` +
            `Code: ${redemptionCode3}\n\n` +
            `There is no official website to redeem codes, you need to log-into your game to be able to redeem the code!`)
            .setImage(imageUrl)
            .setFooter({ text: `${username}`, iconURL: avatarURL })
            .setTimestamp();
        const embedsMap = {
            "genshin": [genshinPing],
            "hsr": [hsrPing],
            "wuwa": [wuwaPing],
        };
        const gameEmojis = {
            "genshin": "<:Primogem:977169624187695104>",
            "hsr": "<:jade:1131210828704645175>",
            "wuwa": "<:astrite:1337342930448551987>",
        };
        const gameRoles = {
            "genshin": GenshinPing,
            "hsr": HSRPing,
            "wuwa": WuwaPing,
        };
        const roleToPing = gameRoles[game] || "";
        const embedsToSend = embedsMap[game];
        const channel = interaction.channel;
        if (embedsToSend) {
            const sentMessage = await channel.send({
                content: roleToPing ? `<@&${roleToPing}>` : "",
                embeds: embedsToSend,
            });
            const emojiToReact = gameEmojis[game];
            if (emojiToReact) {
                const emojiMatch = emojiToReact.match(/<:\w+:(\d+)>/);
                if (emojiMatch) {
                    const emojiId = emojiMatch[1];
                    await sentMessage.react(emojiId);
                }
            }
            await interaction.reply({
                content: "✅ Redemption Code Sent!!",
                flags: 64,
            });
            const MessageString = `Command executed successfully! : Game:"${game}", Code: "${redemptionCode1}" | "${redemptionCode2}" | "${redemptionCode3}" sent!`;
            (0, logger_custom_1.logger_custom)(userName, "game-code", MessageString);
        }
    }
};
exports.default = GameLivestreamCode;
