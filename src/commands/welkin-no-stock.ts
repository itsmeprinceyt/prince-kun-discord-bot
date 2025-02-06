import { Roles } from "../utility/roles";
const StockUpdate = Roles[5].roleId;
const MarketUpdate = Roles[4].roleId;

import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    TextChannel,
    GuildMember
} from "discord.js";
import chalk from "chalk";

import { Command } from "../types/Command";

const WelkinNoStock: Command = {
    data: new SlashCommandBuilder()
        .setName("welkin-no-stock")
        .setDescription("Sends an embed about Genshin Impact's Welkin Moon Stock."),

    async execute(interaction: ChatInputCommandInteraction) {
        const isDM = !interaction.guild;
        const location = isDM ? "DM" : `Server: ${interaction.guild?.name}`;
        if (isDM) {
            await interaction.reply({
                content: "This is a Server-Only Command! 🖕",
                flags: 64,
            });
            return;
        }

        const ownerId = interaction.guild!.ownerId;
        if (interaction.user.id !== ownerId) {
            await interaction.reply({
                content: "🚫 Only the server owner can use this command!",
                flags: 64,
            });

            console.log(
                chalk.underline(`[ INFO ]`) +
                "\n" +
                chalk.yellow(`User: ${interaction.user.username}`) +
                "\n" +
                chalk.magenta(`Command: /welkin-no-stock`) +
                "\n" +
                chalk.cyan(`Location: ${location}`) +
                "\n" +
                chalk.red(`Message: Unauthorized user attempted to execute!\n`)
            );
            return;
        }

        const embed1 = new EmbedBuilder()
            .setColor(0xff0000)
            .setAuthor({
                name: "Prince-Kun • Genshin Impact",
                iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("Blessing of the Welkin Moon is out of Stock !")
            .setDescription(`\`\`\`GENSHIN IMPACT - BLESSING OF THE WELKIN MOON\`\`\``)
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1337171003356221461/Blessing_of_the_Welkin.png")


        const embed2 = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Note")
            .setDescription(`You can message <@310672946316181514> to ask for more information!`);


        const channel = interaction.channel as TextChannel;
        const member = interaction.member as GuildMember;
                const userName = member?.displayName || interaction.user.username;
        await channel.send({ embeds: [embed1, embed2] });

        await interaction.reply({
            content: "✅ Welkin information sent!",
            flags: 64,
        });

        console.log(
            chalk.underline(`[ INFO ]`) +
            "\n" +
            chalk.yellow(`User: ${userName}`) +
            "\n" +
            chalk.yellow(`Username: ${interaction.user.username}`) +
            "\n" +
            chalk.magenta(`Command: /welkin-no-stock`) +
            "\n" +
            chalk.cyan(`Location: ${location}`) +
            "\n" +
            chalk.green(`Message: Command executed successfully!\n`)
        );
    },
};

export default WelkinNoStock;
