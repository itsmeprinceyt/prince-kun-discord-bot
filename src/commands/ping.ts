import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  GuildMember,
  AttachmentBuilder
} from "discord.js";
import { Command } from "../types/Command";
import chalk from "chalk";
import path from "path";

const pingCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with something Mambo!!"),
  async execute(interaction: ChatInputCommandInteraction) {
    const ownerId = interaction.guild?.ownerId;
    const isDM = !interaction.guild;
    const location = isDM ? "DM" : `Server: ${interaction.guild?.name}`;

    if (isDM) {
      await interaction.reply({
        content: "This is a Server-Only Command! 🖕",
        flags: 64,
      });

      console.log(
        chalk.underline(`[ INFO ]`) +
          "\n" +
          chalk.yellow(`User: ${interaction.user.username}`) +
          "\n" +
          chalk.magenta(`Command: /ping`) +
          "\n" +
          chalk.cyan(`Location: DM`) +
          "\n" +
          chalk.cyan(`Message: Attempted to execute in DM!\n`)
      );
      return;
    }

    const member = interaction.member as GuildMember;
    const userName = member.displayName || interaction.user.username;
    const gifPath = path.join(__dirname, "../public/GIF/sonic-sonic-exe.gif");
    const gifPath2 = path.join(__dirname, "../public/GIF/mambo.gif");
    const NonAdmin = new AttachmentBuilder(gifPath);
    const Admin = new AttachmentBuilder(gifPath2);

    if (interaction.user.id !== ownerId) {
      await interaction.reply({
        files: [NonAdmin],
        flags: 64,
      });
      await interaction.followUp("Pong!");

      console.log(
        chalk.underline(`[ INFO ]`) +
          "\n" +
          chalk.yellow(`User: ${userName}`) +
          "\n" +
          chalk.yellow(`Username: ${interaction.user.username}`) +
          "\n" +
          chalk.magenta(`Command: /ping`) +
          "\n" +
          chalk.cyan(`Location: ${location}`) +
          "\n" +
          chalk.red(`Message: Unauthorized user attempted to execute!\n`)
      );

      return;
    }

    await interaction.reply({
      files: [Admin],
    });
    await interaction.followUp("Pong!");

    console.log(
      chalk.underline(`[ INFO ]`) +
        "\n" +
        chalk.yellow(`User: ${userName}`) +
        "\n" +
        chalk.yellow(`Username: ${interaction.user.username}`) +
        "\n" +
        chalk.magenta(`Command: /ping`) +
        "\n" +
        chalk.cyan(`Location: ${location}`) +
        "\n" +
        chalk.green(`Message: Command executed successfully!\n`)
    );
  },
};

export default pingCommand;
