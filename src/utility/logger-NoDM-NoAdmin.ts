import chalk from "chalk";
import { ChatInputCommandInteraction } from "discord.js";
import { getFormattedIST } from "./time";

export function logger_NoDM_NoAdmin(interaction: ChatInputCommandInteraction) {
    const location = interaction.guild ? `Server: ${interaction.guild.name}` : "DM";

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
        chalk.red(`Message: Unauthorized user attempted to execute!\n`)
    );
}

