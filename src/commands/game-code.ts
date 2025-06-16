import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    TextChannel,
    GuildMember
} from "discord.js";

import { Command } from "../types/Command.type";
import { logger_NoDM_NoAdmin } from "../utility/loggers/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/loggers/logger-custom";

import { PING_Roles } from "../utility/uuid/PingRoles";
import { RolesPerms } from "../utility/uuid/RolesPerms";
import { ProfileAuthorPicture, DefaultImageGenshin, DefaultImageHSR, DefaultImageWuwa, DefaultImageZZZ} from '../utility/utils';
import { BLUE_EMBED, ORANGE_EMBED } from "../utility/uuid/Colors";
const GenshinPing = PING_Roles[1].roleId;
const HSRPing = PING_Roles[2].roleId;
const WuwaPing = PING_Roles[3].roleId;
const ZZZPing = PING_Roles[6].roleId;
const CodePoster = RolesPerms[0].roleId;

const userCache = new Map<string, { username: string; avatarURL: string }>();

const GameCode: Command = {
    data: new SlashCommandBuilder()
        .setName("game-code")
        .setDescription("Sends an embed about a game's redemption code.")
        .addStringOption((option) =>
            option.setName("game")
                .setDescription("Select game")
                .setRequired(true)
                .addChoices(
                    { name: "Genshin Impact", value: "genshin" },
                    { name: "Honkai Star Rail", value: "hsr" },
                    { name: "Wuthering Waves", value: "wuwa" },
                    { name: "Zenless Zone Zero", value: "zzz" }
                )
        )
        .addStringOption(option =>
            option.setName("redemption_code")
                .setDescription("Enter the redemption code")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("code_title")
                .setDescription("Enter the title for this code/what are the rewards?")
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option.setName("usedefaultimage")
                .setDescription("Use the default image? Select No if you have customImageUrl")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("custom_image_url")
                .setDescription("Enter a custom image URL")
                .setRequired(false)
        ) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        const isDM = !interaction.guild;
        if (isDM) {
            await interaction.reply({
                content: "This is a Server-Only Command! 🖕",
                flags: 64,
            });
            logger_NoDM_NoAdmin(interaction);
            return;
        }

        const member = interaction.member as GuildMember;
        const userRoles = member.roles.cache.map(role => role.id);
        const ownerId = interaction.guild!.ownerId;
        const hasRequiredRole = userRoles.includes(CodePoster);

        if (interaction.user.id !== ownerId && !hasRequiredRole) {
            await interaction.reply({
                content: "🚫 Only the server owner or users with the required role can use this command!",
                flags: 64,
            });
            logger_NoDM_NoAdmin(interaction);
            return;
        }
        userCache.set(interaction.user.id, {
            username: interaction.user.username,
            avatarURL: interaction.user.displayAvatarURL(),
        });

        const userInfo = userCache.get(interaction.user.id);
        const username = userInfo?.username || interaction.user.username;
        const avatarURL = userInfo?.avatarURL || interaction.user.displayAvatarURL();


        const game: string = interaction.options.getString("game", true);
        const redemptionCode: string = interaction.options.getString("redemption_code", true);
        const codeTitle: string = interaction.options.getString("code_title", true);
        const useDefaultImage: boolean = interaction.options.getBoolean("usedefaultimage", true);
        const customImageUrl: string | null = interaction.options.getString("custom_image_url")?.trim() || null;
        const sanitizedImageUrl: string | null = customImageUrl ? customImageUrl.replace(/\?.*$/, "") : null;

        let imageUrl: string = "";

        if (game === "genshin" && useDefaultImage) {
            imageUrl = DefaultImageGenshin;
        } else if (game === "hsr" && useDefaultImage) {
            imageUrl = DefaultImageHSR;
        } else if (game === "wuwa" && useDefaultImage) {
            imageUrl = DefaultImageWuwa;
        } else if (game === "zzz" && useDefaultImage) {
            imageUrl = DefaultImageZZZ;
        } else if (!useDefaultImage && sanitizedImageUrl) {
            imageUrl = sanitizedImageUrl;
        } else {
            await interaction.reply({
                content: "❌ Please provide a custom image URL if not using the default image!",
                flags: 64,
            });
            return;
        }

        /*=================================================== GENSHIN IMPACT*/
        const genshinPing = new EmbedBuilder()
            .setColor(BLUE_EMBED)
            .setAuthor({
                name: "Prince-Kun • Genshin Impact",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle(`${codeTitle}`)
            .setDescription(
                `Code: [${redemptionCode}](https://genshin.hoyoverse.com/en/gift?code=${redemptionCode})\n\n` +
                `Click on the code above or redeem through the website below:\n https://genshin.hoyoverse.com/en/gift`
            )
            .setImage(imageUrl)
            .setFooter({ text: `${username}`, iconURL: avatarURL })
            .setTimestamp();
        /*=================================================== HONKAI STAR RAIL*/
        const hsrPing = new EmbedBuilder()
            .setColor(BLUE_EMBED)
            .setAuthor({
                name: "Prince-Kun • Honkai Star Rail",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle(`${codeTitle}`)
            .setDescription(
                `Code: [${redemptionCode}](https://hsr.hoyoverse.com/gift?code=${redemptionCode})\n\n` +
                `Click on the code above or redeem through the website below:\n https://hsr.hoyoverse.com/gift`
            )
            .setImage(imageUrl)
            .setFooter({ text: `${username}`, iconURL: avatarURL })
            .setTimestamp();

        /*=================================================== WUTHERING WAVES*/
        const wuwaPing = new EmbedBuilder()
            .setColor(BLUE_EMBED)
            .setAuthor({
                name: "Prince-Kun • Wuthering Waves",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle(`${codeTitle}`)
            .setDescription(
                `Code: ${redemptionCode}\n\n` +
                `There is no official website to redeem codes, you need to log-into your game to be able to redeem the code!`
            )
            .setImage(imageUrl)
            .setFooter({ text: `${username}`, iconURL: avatarURL })
            .setTimestamp();
        /*=================================================== ZENLESS ZONE ZERO*/
        const zzzPing = new EmbedBuilder()
            .setColor(ORANGE_EMBED)
            .setAuthor({
                name: "Prince-Kun • Zenless Zone Zero",
                iconURL: ProfileAuthorPicture,
            })
            .setTitle(`${codeTitle}`)
            .setDescription(
                `Code: [${redemptionCode}](https://zenless.hoyoverse.com/redemption?code=${redemptionCode})\n\n` +
                `Click on the code above or redeem through the website below:\n https://zenless.hoyoverse.com/redemption`
            )
            .setImage(imageUrl)
            .setFooter({ text: `${username}`, iconURL: avatarURL })
            .setTimestamp();

        const embedsMap: Record<string, EmbedBuilder[]> = {
            "genshin": [genshinPing],
            "hsr": [hsrPing],
            "wuwa": [wuwaPing],
            "zzz": [zzzPing],
        };

        const gameEmojis: Record<string, string> = {
            "genshin": "<:Primogem:977169624187695104>",
            "hsr": "<:jade:1131210828704645175>",
            "wuwa": "<:astrite:1337342930448551987>",
            "zzz": "<:polychrome:1341859138766110842>",
        };
        const gameRoles: Record<string, string> = {
            "genshin": GenshinPing,
            "hsr": HSRPing,
            "wuwa": WuwaPing,
            "zzz": ZZZPing,
        };

        const roleToPing: string = gameRoles[game] || "";
        const embedsToSend = embedsMap[game];

        const channel = interaction.channel as TextChannel;
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
            logger_custom(username, "game-code", MessageString);
        }
    }
}

export default GameCode;