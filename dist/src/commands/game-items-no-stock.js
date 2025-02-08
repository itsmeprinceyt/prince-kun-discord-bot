"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rolePerms_1 = require("../utility/rolePerms");
const ShopManager = rolePerms_1.RolesPerms[1].roleId;
const discord_js_1 = require("discord.js");
const chalk_1 = __importDefault(require("chalk"));
const ShopItemsNoStock = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("game-items-no-stock")
        .setDescription("Sends an embed about selected game stock item being out of stock.")
        .addStringOption((option) => option.setName("item")
        .setDescription("Select the item")
        .setRequired(true)
        .addChoices({ name: "Welkin Moon", value: "welkin" }, { name: "Express Pass", value: "express-pass" }, { name: "Lunite Subscription", value: "lunite-subscription" }, { name: "Inter-Knot Membership", value: "inter-knot-membership" })),
    async execute(interaction) {
        const isDM = !interaction.guild;
        const location = isDM ? "DM" : `Server: ${interaction.guild?.name}`;
        if (isDM) {
            await interaction.reply({
                content: "This is a Server-Only Command! 🖕",
            });
            return;
        }
        const ownerId = interaction.guild.ownerId;
        const member = interaction.member;
        if (interaction.user.id !== ownerId && !member.roles.cache.has(ShopManager)) {
            await interaction.reply({
                content: "🚫 You don't have permission to use this command!",
            });
            console.log(chalk_1.default.underline(`[ INFO ]`) +
                "\n" +
                chalk_1.default.yellow(`User: ${interaction.user.username}`) +
                "\n" +
                chalk_1.default.magenta(`Command: /game-items-no-stock`) +
                "\n" +
                chalk_1.default.cyan(`Location: ${location}`) +
                "\n" +
                chalk_1.default.red(`Message: Unauthorized user attempted to execute!\n`));
            return;
        }
        const item = interaction.options.getString("item", true);
        const welkin = new discord_js_1.EmbedBuilder()
            .setColor(0xff0000)
            .setAuthor({
            name: "Prince-Kun • Genshin Impact",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
            .setTitle("Blessing of the Welkin Moon is out of Stock!")
            .setDescription("```GENSHIN IMPACT - BLESSING OF THE WELKIN MOON```")
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1337171003356221461/Blessing_of_the_Welkin.png");
        const express_pass = new discord_js_1.EmbedBuilder()
            .setColor(0xff0000)
            .setAuthor({
            name: "Prince-Kun • Honkai Star Rail",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
            .setTitle("Express Pass is out of Stock!")
            .setDescription("```HONKAI STAR RAIL - EXPRESS PASS```")
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1337171003843018893/Express_Supply_Pass.png");
        const lunite_subscription = new discord_js_1.EmbedBuilder()
            .setColor(0xff0000)
            .setAuthor({
            name: "Prince-Kun • Wuthering Waves",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
            .setTitle("Lunite Subscription is out of Stock!")
            .setDescription("```WUTHERING WAVES - LUNITE SUBSCRIPTION```")
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1337171011216605297/Lunite_Subscription.png");
        const inter_knot_membership = new discord_js_1.EmbedBuilder()
            .setColor(0xff0000)
            .setAuthor({
            name: "Prince-Kun • Zenless Zone Zero",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
            .setTitle("Inter-Knot Membership is out of Stock!")
            .setDescription("```ZENLESS ZONE ZERO - INTER-KNOT MEMBERSHIP```")
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1337171008834113546/Inter-Knot_Membership.png");
        const bottomEmbed = new discord_js_1.EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Note")
            .setDescription(`You can message <@310672946316181514> to ask for more information!`);
        const embedsMap = {
            "welkin": [welkin, bottomEmbed],
            "express-pass": [express_pass, bottomEmbed],
            "lunite-subscription": [lunite_subscription, bottomEmbed],
            "inter-knot-membership": [inter_knot_membership, bottomEmbed],
        };
        const embedsToSend = embedsMap[item];
        const channel = interaction.channel;
        if (embedsToSend) {
            await channel.send({
                embeds: embedsToSend,
            });
        }
        const userName = member?.displayName || interaction.user.username;
        console.log(chalk_1.default.underline(`[ INFO ]`) +
            "\n" +
            chalk_1.default.yellow(`User: ${userName}`) +
            "\n" +
            chalk_1.default.yellow(`Username: ${interaction.user.username}`) +
            "\n" +
            chalk_1.default.magenta(`Command: /game-items-no-stock`) +
            "\n" +
            chalk_1.default.cyan(`Location: ${location}`) +
            "\n" +
            chalk_1.default.green(`Message: Command executed successfully! : "${item}"\n`));
        await interaction.reply({
            content: "✅ Stock information sent!",
            flags: 64,
        });
    },
};
exports.default = ShopItemsNoStock;
