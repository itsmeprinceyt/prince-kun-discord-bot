"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_NoDM_NoAdmin_1 = require("../utility/logger-NoDM-NoAdmin");
const logger_custom_1 = require("../utility/logger-custom");
const rolePerms_1 = require("../utility/rolePerms");
const ShopManager = rolePerms_1.RolesPerms[1].roleId;
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
        if (isDM) {
            await interaction.reply({
                content: "This is a Server-Only Command! 🖕",
            });
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
            return;
        }
        const ownerId = interaction.guild.ownerId;
        const member = interaction.member;
        if (interaction.user.id !== ownerId && !member.roles.cache.has(ShopManager)) {
            await interaction.reply({
                content: "🚫 You don't have permission to use this command!",
            });
            (0, logger_NoDM_NoAdmin_1.logger_NoDM_NoAdmin)(interaction);
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
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1337171003356221461/Blessing_of_the_Welkin.png")
            .setTimestamp();
        const express_pass = new discord_js_1.EmbedBuilder()
            .setColor(0xff0000)
            .setAuthor({
            name: "Prince-Kun • Honkai Star Rail",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
            .setTitle("Express Pass is out of Stock!")
            .setDescription("```HONKAI STAR RAIL - EXPRESS PASS```")
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1337171003843018893/Express_Supply_Pass.png")
            .setTimestamp();
        const lunite_subscription = new discord_js_1.EmbedBuilder()
            .setColor(0xff0000)
            .setAuthor({
            name: "Prince-Kun • Wuthering Waves",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
            .setTitle("Lunite Subscription is out of Stock!")
            .setDescription("```WUTHERING WAVES - LUNITE SUBSCRIPTION```")
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1337171011216605297/Lunite_Subscription.png")
            .setTimestamp();
        const inter_knot_membership = new discord_js_1.EmbedBuilder()
            .setColor(0xff0000)
            .setAuthor({
            name: "Prince-Kun • Zenless Zone Zero",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
            .setTitle("Inter-Knot Membership is out of Stock!")
            .setDescription("```ZENLESS ZONE ZERO - INTER-KNOT MEMBERSHIP```")
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1337171008834113546/Inter-Knot_Membership.png")
            .setTimestamp();
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
        const MessageString = `Command executed successfully! : "${item}`;
        (0, logger_custom_1.logger_custom)(userName, "game-items-no-stock", MessageString);
        await interaction.reply({
            content: "✅ Stock information sent!",
            flags: 64,
        });
    },
};
exports.default = ShopItemsNoStock;
