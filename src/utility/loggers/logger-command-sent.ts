import chalk from "chalk";
import { ChatInputCommandInteraction } from "discord.js";
import { getFormattedIST } from "../loggers/time";

export function logger_command_sent(interaction: ChatInputCommandInteraction) {
    const location: string = interaction.guild ? `Server: ${interaction.guild.name}` : "DM";

    console.log(
        chalk.underline(`[ INFO ]`) +
        "\n" +
        chalk.yellow(`User: ${interaction.user.username}`) +
        "\n" +
        chalk.magenta(`Command: /${interaction.commandName}`) +
        "\n" +
        chalk.cyan(`Location: ${location}`) +
        "\n" +
        chalk.blue(getFormattedIST()) +
        "\n" +
        chalk.green(`Message: Command executed successfully!\n`)
    );
}

