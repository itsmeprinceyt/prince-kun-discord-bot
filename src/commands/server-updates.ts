import { Roles } from "../utility/roles";
const changesRoleId = Roles[0].roleId;

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

const serverUpdatesCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("server-updates")
        .setDescription("Send an embed message for server updates (admin only)."),

    async execute(interaction: ChatInputCommandInteraction) {
        const isDM = !interaction.guild;
        const location = isDM ? "DM" : `Server: ${interaction.guild?.name}`;

        if (isDM) {
            await interaction.reply({
                content: "This is a Server-Only Command! 🖕",
                ephemeral: true,
            });
            console.log(
                chalk.underline(`[ INFO ]`) +
                "\n" +
                chalk.yellow(`User: ${interaction.user.username}`) +
                "\n" +
                chalk.magenta(`Command: /server-updates`) +
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
                ephemeral: true,
            });

            console.log(
                chalk.underline(`[ INFO ]`) +
                "\n" +
                chalk.yellow(`User: ${interaction.user.username}`) +
                "\n" +
                chalk.magenta(`Command: /server-updates`) +
                "\n" +
                chalk.cyan(`Location: ${location}`) +
                "\n" +
                chalk.red(`Message: Unauthorized user attempted to execute!\n`)
            );
            return;
        }

        const modal = new ModalBuilder()
            .setCustomId("serverUpdatesModal")  // Unique custom ID
            .setTitle("Server Update Message");

        const messageInput = new TextInputBuilder()
            .setCustomId("serverUpdateMessage")
            .setLabel("Enter the update message:")
            .setStyle(TextInputStyle.Paragraph);

        const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    },
};

export default serverUpdatesCommand;

export async function handleServerModalSubmit(interaction: ModalSubmitInteraction) {
    if (interaction.customId !== "serverUpdatesModal") return;

    const messageContent = interaction.fields.getTextInputValue("serverUpdateMessage");
    const userInfo = userCache.get(interaction.user.id);
    const username = userInfo?.username || "Unknown User";
    const avatarURL = userInfo?.avatarURL || interaction.user.displayAvatarURL();

    const embed = new EmbedBuilder()
        .setColor(0xffffff)
        .setAuthor({
            name: "Prince-Kun • Server Update",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
        .setTitle("📢 Latest Server Changes & Improvements!")
        .setDescription(messageContent)
        .setImage("https://media.discordapp.net/attachments/1336322293437038602/1337156724628525127/Server_Changes.png")
        .setFooter({
            text: `${username} | ${new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
            })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
            iconURL: avatarURL,
        });

    await interaction.reply({
        content: "✅ Server update message sent!",
        ephemeral: true,
    });

    console.log(
        chalk.underline(`[ INFO ]`) +
        "\n" +
        chalk.yellow(`User: ${username}`) +
        "\n" +
        chalk.magenta(`Command: /server-updates modal submit`) +
        "\n" +
        chalk.green(`Message: Server update sent successfully!\n`)
    );

    const channel = interaction.channel as TextChannel;
    if (channel) {
        await channel.send({
            content: `<@&${changesRoleId}>`,
            embeds: [embed],
        });
    }
}
