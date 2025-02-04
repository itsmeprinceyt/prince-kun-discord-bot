import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  GuildMember,
} from "discord.js";
import { Command } from "../types/Command";
import chalk from "chalk";

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
        content: "😂 Use it in a server, you idiot!",
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

    if (interaction.user.id !== ownerId) {
      await interaction.reply({
        content: "https://media.tenor.com/suSxl49GmxsAAAAM/sonic-sonic-exe.gif",
        flags: 64,
      });
      await interaction.followUp({
        content: "🚫 You must be the server owner to use this command!",
        flags: 64, // Ephemeral flag
      });

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

    await interaction.reply(
      "https://media.tenor.com/vn3L0I7IjR4AAAAM/uma-uma-musume.gif"
    );
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
