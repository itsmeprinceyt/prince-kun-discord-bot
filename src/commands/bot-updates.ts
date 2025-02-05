import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    TextInputBuilder,
    ModalBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ModalSubmitInteraction,
    TextChannel
} from "discord.js";
import { Command } from "../types/Command";
import chalk from "chalk";

const userCache = new Map<string, { username: string; avatarURL: string }>();

const botUpdatesCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("bot-updates")
        .setDescription("Send an embed message for bot updates (Owner Only)."),

    async execute(interaction: ChatInputCommandInteraction) {
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
                chalk.magenta(`Command: /bot-updates`) +
                "\n" +
                chalk.cyan(`Location: DM`) +
                "\n" +
                chalk.cyan(`Message: Attempted to execute in DM!\n`)
            );
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
                chalk.magenta(`Command: /bot-updates`) +
                "\n" +
                chalk.cyan(`Location: ${location}`) +
                "\n" +
                chalk.red(`Message: Unauthorized user attempted to execute!\n`)
            );
            return;
        }

        userCache.set(interaction.user.id, {
            username: interaction.user.username,
            avatarURL: interaction.user.displayAvatarURL(),
        });

        console.log(
            chalk.underline(`[ INFO ]`) +
            "\n" +
            chalk.yellow(`User: ${interaction.user.username}`) +
            "\n" +
            chalk.magenta(`Command: /bot-updates`) +
            "\n" +
            chalk.cyan(`Location: ${location}`) +
            "\n" +
            chalk.green(`Message: Command executed successfully!\n`)
        );

        const modal = new ModalBuilder()
            .setCustomId("botUpdatesModal")
            .setTitle("Bot Update Message");

        const messageInput = new TextInputBuilder()
            .setCustomId("botUpdateMessage")
            .setLabel("Enter the update message:")
            .setStyle(TextInputStyle.Paragraph);

        const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    },
};

export default botUpdatesCommand;

export async function handleModalSubmit(interaction: ModalSubmitInteraction) {
    if (interaction.customId !== "botUpdatesModal") return;

    const messageContent = interaction.fields.getTextInputValue("botUpdateMessage");
    const userInfo = userCache.get(interaction.user.id);
    const username = userInfo?.username || "Unknown User";
    const avatarURL = userInfo?.avatarURL || interaction.user.displayAvatarURL();

    const embed = new EmbedBuilder()
        .setColor(0xc200ff)
        .setAuthor({
            name: "Prince-Kun • Bot Update",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
        .setTitle("Changelog: Check Out the Latest Update & Tweaks!")
        .setDescription(messageContent)
        .setImage("https://media.discordapp.net/attachments/1336322293437038602/1336814350249365554/Bot_Updates.png")
        .setFooter({
            text: `${username} | ${new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
            })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
            iconURL: avatarURL,
        });

    await interaction.reply({
        content: "✅ Update message sent!",
        flags: 64,
    });

    console.log(
        chalk.underline(`[ INFO ]`) +
        "\n" +
        chalk.yellow(`User: ${username}`) +
        "\n" +
        chalk.magenta(`Command: /bot-updates modal submit`) +
        "\n" +
        chalk.green(`Message: Update sent successfully!\n`)
    );

    const channel = interaction.channel as TextChannel;
    if (channel) {
        await channel.send({ embeds: [embed] });
    }
}