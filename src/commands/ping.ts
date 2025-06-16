import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  GuildMember,
  AttachmentBuilder
} from "discord.js";
import path from "path";

import { Command } from "../types/Command.type";
import { logger_NoDM_NoAdmin } from "../utility/loggers/logger-NoDM-NoAdmin";
import { logger_custom } from "../utility/loggers/logger-custom";

const pingCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with something Mambo!!"),
  async execute(interaction: ChatInputCommandInteraction) {
    const ownerId = interaction.guild?.ownerId;
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
    const userName: string = member.displayName || interaction.user.username;
    const gifPath: string = path.join(__dirname, "../public/GIF/sonic-sonic-exe.gif");
    const gifPath2: string = path.join(__dirname, "../public/GIF/mambo.gif");
    const NonAdmin = new AttachmentBuilder(gifPath);
    const Admin = new AttachmentBuilder(gifPath2);

    if (interaction.user.id !== ownerId) {
      await interaction.reply({
        files: [NonAdmin],
        flags: 64,
      });
      await interaction.followUp("Pong!");
      logger_NoDM_NoAdmin(interaction);
      return;
    }

    await interaction.reply({
      files: [Admin],
    });
    await interaction.followUp("Pong!");
    logger_custom(userName,"ping","Command executed successfully!");
  },
};

export default pingCommand;
