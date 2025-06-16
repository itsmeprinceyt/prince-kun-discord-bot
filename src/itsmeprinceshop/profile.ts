import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ComponentType,
  GuildMember,
  User,
  AttachmentBuilder
} from "discord.js";
import moment from "moment-timezone";

import pool from "../db";
import { Command } from "../types/Command.type";
import { logger_custom } from "../utility/loggers/logger-custom";
import { ItsMePrinceRules } from "../utility/commands/rules/itsmeprince-rules";
import { generateSPVImage } from "../utility/spv/spvImage";
import { EMOTES } from "../utility/uuid/Emotes";
import { WebsiteLink } from '../utility/utils';
const GC = EMOTES[0].roleId;
const YC = EMOTES[1].roleId;
const RC = EMOTES[2].roleId;
const BC = EMOTES[3].roleId;
const PC = EMOTES[4].roleId;

import { COLOR_PRIMARY, YELLOW_EMBED } from "../utility/uuid/Colors";
import { ProfileAuthorPicture } from "../utility/utils";
import { getRegistrationSuccessEmbed } from '../utility/embeds/register-done';

const profileCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Check your ItsMe Prince Shop profile or someone else's.")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Mention a user to check their profile.")
        .setRequired(false)
    ) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction) {
    const mentionedUser: User | null = interaction.options.getUser("user");
    const targetUser = mentionedUser || interaction.user;
    const targetUserId: string = targetUser.id;
    const targetUsername: string = targetUser.username;
    const targetDisplayName: string = (interaction.guild?.members.cache.get(targetUserId) as GuildMember)?.displayName || targetUsername;
    if (mentionedUser) {
      const [rows]: any = await pool.query("SELECT pp_cash FROM users WHERE user_id = ?", [mentionedUser.id]);
      if (rows.length === 0) {
        await interaction.reply({
          content: `❌ **${mentionedUser.username}** is not registered in the ItsMe Prince Shop database.`,
          flags: 64,
        });
        return;
      }
    }
    const [rows]: any = await pool.query(
      "SELECT pp_cash, refer_tickets, total_purchases, registration_date, total_referred, spv FROM users WHERE user_id = ?",
      [targetUserId]
    );

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
      const avatarURL = mentionedUser && rows.length > 0
        ? mentionedUser.displayAvatarURL()
        : interaction.user.displayAvatarURL();
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

      await interaction.reply({
        embeds: [embed],
        components: [row],
        files: [attachment]
      });
      const MessageString = `[ DATABASE ] User ${targetDisplayName} (${targetUserId}) fetched profile`;
      logger_custom(targetDisplayName, "profile", MessageString);
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(COLOR_PRIMARY)
      .setAuthor({
        name: "Prince-Kun • ItsMe Prince Shop",
        iconURL: ProfileAuthorPicture,
      })
      .setTitle("Rules & Information")
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTitle("ItsMe Prince Shop - Profile Registeration")
      .setDescription(ItsMePrinceRules + `**You accept the rules by registering and you also agree to any future updates or changes in the value of PP CASH. It is your responsibility to stay updated with the latest rules.**`)
      .setFooter({ text: `${targetDisplayName}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    const registerButton = new ButtonBuilder()
      .setCustomId(`register_${targetUserId}`)
      .setLabel("Accept & Register")
      .setStyle(ButtonStyle.Success);

    const cancelButton = new ButtonBuilder()
      .setCustomId(`cancel_${targetUserId}`)
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(registerButton, cancelButton);

    const reply = await interaction.reply({
      embeds: [embed],
      components: [row]
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 30000,
      filter: (buttonInteraction) => buttonInteraction.user.id === targetUserId
    });

    collector.on("collect", async (buttonInteraction) => {
      if (buttonInteraction.customId === `register_${targetUserId}`) {
        const istTime = moment.utc().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
        await pool.query(
          "INSERT INTO users (user_id, pp_cash, refer_tickets, total_purchases, registration_date, total_referred) VALUES (?, ?, ?, ?, ?, ?)",
          [targetUserId, 0, 0, 0, istTime, 0]
        );

        const MessageString = `[ DATABASE ] User ${targetDisplayName} (${targetUserId}) registered`;
        logger_custom(targetDisplayName, "profile", MessageString);

        await buttonInteraction.update({
          embeds: [getRegistrationSuccessEmbed(interaction.user)],
          components: []
        });
      } else if (buttonInteraction.customId === `cancel_${targetUserId}`) {
        console.log(`[ INFO ] User ${targetDisplayName} (${targetUserId}) cancelled registration.`);

        await buttonInteraction.update({
          content: "Registration cancelled.",
          components: []
        });
      }
    });

    collector.on("end", async () => {
      try {
        await interaction.editReply({ components: [] });
      } catch (error) {
        console.error(`[ ERROR ] Failed to edit reply after collector ended: ${error}`);
      }
    });
  }
};

export default profileCommand;
