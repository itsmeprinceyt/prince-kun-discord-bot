"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleServerModalSubmit = handleServerModalSubmit;
const roles_1 = require("../utility/roles");
const changesRoleId = roles_1.Roles[0].roleId;
const discord_js_1 = require("discord.js");
const chalk_1 = __importDefault(require("chalk"));
const userCache = new Map();
const serverUpdatesCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("server-updates")
        .setDescription("Send an embed message for server updates (admin only)."),
    async execute(interaction) {
        const isDM = !interaction.guild;
        const location = isDM ? "DM" : `Server: ${interaction.guild?.name}`;
        if (isDM) {
            await interaction.reply({
                content: "This is a Server-Only Command! 🖕",
                flags: 64,
            });
            console.log(chalk_1.default.underline(`[ INFO ]`) +
                "\n" +
                chalk_1.default.yellow(`User: ${interaction.user.username}`) +
                "\n" +
                chalk_1.default.magenta(`Command: /server-updates`) +
                "\n" +
                chalk_1.default.cyan(`Location: DM`) +
                "\n" +
                chalk_1.default.cyan(`Message: Attempted to execute in DM!\n`));
            return;
        }
        const ownerId = interaction.guild.ownerId;
        if (interaction.user.id !== ownerId) {
            await interaction.reply({
                content: "🚫 Only the server owner can use this command!",
                flags: 64,
            });
            console.log(chalk_1.default.underline(`[ INFO ]`) +
                "\n" +
                chalk_1.default.yellow(`User: ${interaction.user.username}`) +
                "\n" +
                chalk_1.default.magenta(`Command: /server-updates`) +
                "\n" +
                chalk_1.default.cyan(`Location: ${location}`) +
                "\n" +
                chalk_1.default.red(`Message: Unauthorized user attempted to execute!\n`));
            return;
        }
        const modal = new discord_js_1.ModalBuilder()
            .setCustomId("serverUpdatesModal")
            .setTitle("Server Update Message");
        const messageInput = new discord_js_1.TextInputBuilder()
            .setCustomId("serverUpdateMessage")
            .setLabel("Enter the update message:")
            .setStyle(discord_js_1.TextInputStyle.Paragraph);
        const actionRow = new discord_js_1.ActionRowBuilder().addComponents(messageInput);
        modal.addComponents(actionRow);
        await interaction.showModal(modal);
    },
};
exports.default = serverUpdatesCommand;
async function handleServerModalSubmit(interaction) {
    if (interaction.customId !== "serverUpdatesModal")
        return;
    const messageContent = interaction.fields.getTextInputValue("serverUpdateMessage");
    const userInfo = userCache.get(interaction.user.id);
    const username = userInfo?.username || "Unknown User";
    const avatarURL = userInfo?.avatarURL || interaction.user.displayAvatarURL();
    const embed = new discord_js_1.EmbedBuilder()
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
        flags: 64,
    });
    console.log(chalk_1.default.underline(`[ INFO ]`) +
        "\n" +
        chalk_1.default.yellow(`User: ${username}`) +
        "\n" +
        chalk_1.default.magenta(`Command: /server-updates modal submit`) +
        "\n" +
        chalk_1.default.green(`Message: Server update sent successfully!\n`));
    const channel = interaction.channel;
    if (channel) {
        await channel.send({
            content: `<@&${changesRoleId}>`,
            embeds: [embed],
        });
    }
}
