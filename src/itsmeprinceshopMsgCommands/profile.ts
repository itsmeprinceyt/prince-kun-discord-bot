import {
    Message,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    AttachmentBuilder
} from "discord.js";
import moment from "moment-timezone";
import pool from "../db";
import { generateSPVImage } from "../utility/spv/spvImage";
import { EMOTES } from "../utility/uuid/Emotes";
import { WebsiteLink } from '../utility/utils';
const GC = EMOTES[0].roleId;
const YC = EMOTES[1].roleId;
const RC = EMOTES[2].roleId;
const BC = EMOTES[3].roleId;
const PC = EMOTES[4].roleId;

import { YELLOW_EMBED } from "../utility/uuid/Colors";
import { ProfileAuthorPicture } from "../utility/utils";

const profileCommand = {
    triggers: [".?profile"],
    async execute(message: Message) {
        if (!message.guild) {
            return message.reply("You can only use \`/profile\` in DM");
        }

        const targetUser = message.mentions.users.first() || message.author;
        const targetUserId: string = targetUser.id;
        const targetUsername: string = targetUser.username;
        const avatarURL: string = targetUser.displayAvatarURL();

        const [rows]: any = await pool.query(
            "SELECT pp_cash, refer_tickets, total_purchases, registration_date, total_referred, spv FROM users WHERE user_id = ?",
            [targetUserId]
        );
        if (message.mentions.users.first() && rows.length === 0) {
            return message.reply(`${message.author}, that user is not registered. Ask them register using \`/register\`.`);
        } else if (!message.mentions.users.first() && rows.length === 0) {
            return message.reply("You are not registered. Use \`/register\` to register.");
        }
        if (rows.length > 0) {
            const { pp_cash, refer_tickets, total_purchases, registration_date, total_referred } = rows[0];
            const spv = parseFloat(rows[0].spv) || 0.00;
            const AA = String(pp_cash).padEnd(8, " ");
            const BB = String(refer_tickets).padEnd(8, " ");
            const CC = String(total_purchases).padEnd(8, " ");
            const DD = String(total_referred).padEnd(8, " ");
            const formattedDate = moment(registration_date)
                .tz("Asia/Kolkata", true)
                .format("DD MMM YYYY, hh:mm A");
            const spvRounded = Math.round(spv);
            const imageBuffer = await generateSPVImage(spvRounded);
            const attachment = new AttachmentBuilder(imageBuffer, { name: "spv.png" });

            const embed = new EmbedBuilder()
                .setColor(YELLOW_EMBED)
                .setAuthor({
                    name: "Prince-Kun • Profile Info",
                    iconURL: ProfileAuthorPicture,
                })
                .setThumbnail("attachment://spv.png")
                .setTitle("ItsMe Prince Shop")
                .setDescription(
                    `${YC} **Name:** <@${targetUserId}>\n` +
                    `${YC} **Username:** ${targetUsername}\n` +
                    `${YC} **UserID:** ${targetUserId}\n` +
                    `${YC} **Registered on:** ${formattedDate}\n` +
                    `${YC} **__SPV:__** ${spv.toFixed(2)}\n\n` +
                    `**📦 Inventory & Stats**\n` +
                    `${YC} \`PP Cash          \` • \`${AA}\`\n` +
                    `${YC} \`Referral Tickets \` • \`${BB}\`\n` +
                    `${YC} \`Total Purchases  \` • \`${CC}\`\n` +
                    `${YC} \`Total Referred   \` • \`${DD}\`\n\n` +
                    `**🍱 Extra**\n` +
                    `${GC} \`1 PP Cash = 1₹\`\n` +
                    `${GC} To know rules & information, type \`.?shoprules\``)
                .setFooter({ text: `${targetUsername}`, iconURL: avatarURL })
                .setTimestamp();

            const websiteButton = new ButtonBuilder()
                .setLabel("Visit Shop Website")
                .setStyle(ButtonStyle.Link)
                .setURL(WebsiteLink);

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(websiteButton);

            await (message.channel as any).send({ embeds: [embed], components: [row], files: [attachment] });
            return;
        }
    }
};

export default profileCommand;