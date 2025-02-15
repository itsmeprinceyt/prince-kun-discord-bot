import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ComponentType,
  GuildMember
} from "discord.js";
import moment from "moment-timezone";

import pool from "../db";
import { Command } from "../types/Command";
import { logger_custom } from "../utility/logger-custom";
import { ItsMePrinceRules } from "../utility/itsmeprince-rules";
import { EMOTES } from "../utility/emotes";
const GC = EMOTES[0].roleId;
const YC = EMOTES[1].roleId;
const RC = EMOTES[2].roleId;
const BC = EMOTES[3].roleId;
const PC = EMOTES[4].roleId;

const profileCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Check your ItsMe Prince Shop profile."),

  async execute(interaction: ChatInputCommandInteraction) {
    const userId = interaction.user.id;
    const username = interaction.user.username;
    const member = interaction.member as GuildMember;
    const userName = member?.displayName || interaction.user.username;
    const [rows]: any = await pool.query(
      "SELECT pp_cash, refer_tickets, total_purchases, registration_date, total_referred FROM users WHERE user_id = ?",
      [userId]
    );

    if (rows.length > 0) {

      const { pp_cash, refer_tickets, total_purchases, registration_date, total_referred } = rows[0];
      const AA = String(pp_cash).padEnd(8, " ");
      const BB = String(refer_tickets).padEnd(8, " ");
      const CC = String(total_purchases).padEnd(8, " ");
      const DD = String(total_referred).padEnd(8, " ");
      const formattedDate = moment(registration_date)
        .tz("Asia/Kolkata", true)
        .format("DD MMM YYYY, hh:mm A");

      const embed = new EmbedBuilder()
      .setColor(0xeeff00)
        .setTitle("ItsMe Prince - Profile")
        .setAuthor({
          name: "Prince-Kun • Profile Info",
          iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
      })
        .setThumbnail(interaction.user.displayAvatarURL())
        .setTitle("ItsMe Prince Shop")
        .setDescription(
`${YC} **Name:** <@${userId}>\n`+
`${YC} **Username:** ${username}\n`+
`${YC} **UserID:** ${userId}\n`+
`${YC} **Registered on:** ${formattedDate}\n\n`+

`**Stats**\n` +
`${YC} \`PP Cash          \` • \`${AA}\`\n` +
`${YC} \`Referral Tickets \` • \`${BB}\`\n` +
`${YC} \`Total Purchases  \` • \`${CC}\`\n` +
`${YC} \`Total Referred   \` • \`${DD}\`\n\n` +

`**Extra**\n`+
`${GC} \`1 PP Cash = 1₹\`\n`+
`${GC} To know rules & information, type \`.?shoprules\``)
.setFooter({
  text: `${username} | ${new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
  })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
  iconURL: interaction.user.displayAvatarURL(),
});
        

      await interaction.reply({ embeds: [embed] });
      const MessageString = `[ DATABASE ] User ${userName} (${userId}) fetched profile`;
      logger_custom(userName, "profile", MessageString);
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0xc200ff)
      .setAuthor({
        name: "Prince-Kun • ItsMe Prince Shop",
        iconURL:
          "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
      })
      .setTitle("Rules & Information")
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTitle("ItsMe Prince Shop - Profile Registeration")
      .setDescription(ItsMePrinceRules + `**You accept the rules by registering and you also agree to any future updates or changes in the value of PP CASH. It is your responsibility to stay updated with the latest rules.**`)
      .setFooter({
        text: `${userName} | ${new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
        })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    const registerButton = new ButtonBuilder()
      .setCustomId(`register_${userId}`)
      .setLabel("Accept & Register")
      .setStyle(ButtonStyle.Success);

    const cancelButton = new ButtonBuilder()
      .setCustomId(`cancel_${userId}`)
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
      filter: (buttonInteraction) => buttonInteraction.user.id === userId
    });

    collector.on("collect", async (buttonInteraction) => {
      if (buttonInteraction.customId === `register_${userId}`) {
        const istTime = moment.utc().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
        await pool.query(
          "INSERT INTO users (user_id, pp_cash, refer_tickets, total_purchases, registration_date, total_referred) VALUES (?, ?, ?, ?, ?, ?)",
          [userId, 0, 0, 0, istTime, 0]
      );

        const MessageString = `[ DATABASE ] User ${userName} (${userId}) registered`;
        logger_custom(userName, "profile", MessageString);

        await buttonInteraction.update({
          embeds: [
            new EmbedBuilder()
              .setTitle("Registration Successful!")
              .setThumbnail(interaction.user.displayAvatarURL())
              .setDescription("Well, you're registered!\n Use \`/profile\` to check your inventory!\n\n**Current Marketplace:** https://discord.com/channels/310675536340844544/1177928471951966339/1179354261365211218")
              .setColor(0x00ff00)
          ],
          components: []
        });
      } else if (buttonInteraction.customId === `cancel_${userId}`) {
        console.log(`[ INFO ] User ${userName} (${userId}) cancelled registration.`);

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
