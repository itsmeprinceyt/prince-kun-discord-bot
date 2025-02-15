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
import pool from "../db";
import { Command } from "../types/Command";
import { logger_NoDM_NoAdmin } from "../utility/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/logger-custom";

const profileCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Check your profile and register if needed."),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({
        content: "This is a Server-Only Command! 🖕",
        flags: 64,
      });
      logger_NoDM_NoAdmin(interaction);
      return;
    }

    const userId = interaction.user.id;
    const member = interaction.member as GuildMember;
    const userName = member?.displayName || interaction.user.username;
    const [rows]: any = await pool.query(
      "SELECT pp_cash, refer_tickets, total_purchases FROM users WHERE user_id = ?",
      [userId]
    );

    if (rows.length > 0) {
      const { pp_cash, refer_tickets, total_purchases } = rows[0];

      const embed = new EmbedBuilder()
        .setTitle("Your Profile")
        .setDescription(
          `🎉 **You're registered!**\n` +
          `💰 **PP CASH:** ${pp_cash}\n` +
          `🎟 **Refer Tickets:** ${refer_tickets}\n` +
          `🛒 **Total Purchases:** ${total_purchases}`
        )
        .setColor("Green");

      await interaction.reply({ embeds: [embed], flags: 64 });
      const MessageString = `[ DATABASE ] User ${userName} (${userId}) fetched profile`;
      logger_custom(userName, "profile", MessageString);
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("ItsMe Prince Shop - Profile")
      .setDescription("You are not registered yet. Click **Register** to create your profile.")
      .setColor("Blue");

    const registerButton = new ButtonBuilder()
      .setCustomId(`register_${userId}`)
      .setLabel("Register")
      .setStyle(ButtonStyle.Success);

    const cancelButton = new ButtonBuilder()
      .setCustomId(`cancel_${userId}`)
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(registerButton, cancelButton);

    const reply = await interaction.reply({
      embeds: [embed],
      components: [row],
      flags: 64,
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 30000,
      filter: (buttonInteraction) => buttonInteraction.user.id === userId
    });

    collector.on("collect", async (buttonInteraction) => {
      if (buttonInteraction.customId === `register_${userId}`) {
        await pool.query(
          "INSERT INTO users (user_id, pp_cash, refer_tickets, total_purchases) VALUES (?, ?, ?, ?)",
          [userId, 0, 0, 0]
        );

        const MessageString = `[ DATABASE ] User ${userName} (${userId}) registered`;
        logger_custom(userName, "profile", MessageString);

        await buttonInteraction.update({
          embeds: [
            new EmbedBuilder()
              .setTitle("Registration Successful!")
              .setDescription(
                "🎉 **You are now registered!**\n" +
                "💰 **PP CASH: 0**\n" +
                "🎟 **Refer Tickets: 0**\n" +
                "🛒 **Total Purchases: 0**"
              )
              .setColor("Green")
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
