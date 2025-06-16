import chalk from "chalk";
import { getFormattedIST } from "../loggers/time";

export function logger_custom(username: string, commandName: string, message: string) {
    console.log(
        chalk.underline(`[ INFO ]`) +
        "\n" +
        chalk.yellow(`User: ${username}`) +
        "\n" +
        chalk.magenta(`Command: /${commandName}`) +
        "\n" +
        chalk.blue(getFormattedIST()) +
        "\n" +
        chalk.green(`Message: ${message}\n`)
    );
}
