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
const GameCode = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("game-code")
        .setDescription("Sends an embed about a game's redemption code.")
        .addStringOption((option) => option.setName("game")
        .setDescription("Select game")
        .setRequired(true)
        .addChoices({ name: "Genshin Impact", value: "genshin" }, { name: "Honkai Star Rail", value: "hsr" }, { name: "Wuthering Waves", value: "wuwa" }))
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
        const location = isDM ? "DM" : `Server: ${interaction.guild?.name}`;
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
            .setDescription(`Code: [${redemptionCode}](https://genshin.hoyoverse.com/en/gift?code=${redemptionCode})\n\n` +
            `Click on the code above or redeem through the website below:\n https://genshin.hoyoverse.com/en/gift`)
            .setImage(imageUrl)
            .setFooter({
            text: `${username} | ${new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Kolkata",
            })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
            iconURL: avatarURL,
        });
        /*=================================================== HONKAI STAR RAIL*/
        const hsrPing = new discord_js_1.EmbedBuilder()
            .setColor(0x006eff)
            .setAuthor({
            name: "Prince-Kun • Honkai Star Rail",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
            .setTitle(`${codeTitle}`)
            .setDescription(`Code: [${redemptionCode}](https://hsr.hoyoverse.com/gift?code=${redemptionCode})\n\n` +
            `Click on the code above or redeem through the website below:\n https://hsr.hoyoverse.com/gift`)
            .setImage(imageUrl)
            .setFooter({
            text: `${username} | ${new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Kolkata",
            })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
            iconURL: avatarURL,
        });
        /*=================================================== WUTHERING WAVES*/
        const wuwaPing = new discord_js_1.EmbedBuilder()
            .setColor(0x006eff)
            .setAuthor({
            name: "Prince-Kun • Wuthering Waves",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
            .setTitle(`${codeTitle}`)
            .setDescription(`Code: ${redemptionCode}\n\n` +
            `There is no official website to redeem codes, you need to log-into your game to be able to redeem the code!`)
            .setImage(imageUrl)
            .setFooter({
            text: `${username} | ${new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Kolkata",
            })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
            iconURL: avatarURL,
        });
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
            const MessageString = `Command executed successfully! : Game: "${game}", Code: "${redemptionCode}" sent!`;
            (0, logger_custom_1.logger_custom)(username, "game-code", MessageString);
        }
    }
};
exports.default = GameCode;
