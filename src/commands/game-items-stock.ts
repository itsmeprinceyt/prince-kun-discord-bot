import { Roles } from "../utility/roles";
import { RolesPerms } from "../utility/rolePerms";
const StockUpdate = Roles[5].roleId;
const MarketUpdate = Roles[4].roleId;
const ShopManager = RolesPerms[1].roleId;

import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    TextChannel,
    GuildMember
} from "discord.js";
import chalk from "chalk";

import { Command } from "../types/Command";

const ShopItems: Command = {
    data: new SlashCommandBuilder()
        .setName("game-items-stock")
        .setDescription("Sends an embed about selected game stock item.")
        .addStringOption((option) =>
            option.setName("item")
                .setDescription("Select the item")
                .setRequired(true)
                .addChoices(
                    { name: "Welkin Moon", value: "welkin" },
                    { name: "Express Pass", value: "express-pass" },
                    { name: "Lunite Subscription", value: "lunite-subscription" },
                    { name: "Inter-Knot Membership", value: "inter-knot-membership" }
                )
        )
        .addNumberOption((option) =>
            option.setName("price")
                .setDescription("Enter the price")
                .setRequired(true)
        ) as SlashCommandBuilder,

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

        const member = interaction.member as GuildMember;
        const userName = member?.displayName || interaction.user.username;
        const userRoles = member.roles.cache.map(role => role.id);
        const ownerId = interaction.guild!.ownerId;
        const hasRequiredRole = userRoles.includes(ShopManager);

        if (interaction.user.id !== ownerId && !hasRequiredRole) {
            await interaction.reply({
                content: "🚫 Only the server owner or users with the required role can use this command!",
                flags: 64,
            });
            console.log(
                chalk.underline(`[ INFO ]`) +
                "\n" +
                chalk.yellow(`User: ${userName}`) +
                "\n" +
                chalk.yellow(`Username: ${interaction.user.username}`) +
                "\n" +
                chalk.magenta(`Command: /game-items-stock`) +
                "\n" +
                chalk.cyan(`Location: ${location}`) +
                "\n" +
                chalk.red(`Message: Unauthorized user attempted to execute!\n`)
            );
            return;
        }

        const item = interaction.options.getString("item", true);
        const price = interaction.options.getNumber("price", true);

        /*=================================================== WELKIN*/
        const welkin1 = new EmbedBuilder()
            .setColor(0x00ff00)
            .setAuthor({
                name: "Prince-Kun • Genshin Impact",
                iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("Blessing of the Welkin Moon is in Stock !")
            .setDescription(`\`\`\`GENSHIN IMPACT - BLESSING OF THE WELKIN MOON\`\`\`` +
                `\`\`\`PRICE: ${price} INR/-\`\`\``)
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1337171003356221461/Blessing_of_the_Welkin.png")
            .setFooter({
                text: `Price as of: ${new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                })} ${new Date().getHours() >= 12 ? "PM" : "AM"} | Prices may fluctuate at anytime 👈`,
                iconURL: interaction.user.displayAvatarURL({ extension: "png", size: 512 }),
            });
        const welkin2 = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Read before purchasing")
            .setDescription(`Read <#1177928702114406481> before proceeding`);

        const welkin3 = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("To Purchase")

            .setDescription(`Use <#1181972522900660264> to initiate an order or Message <@310672946316181514>`);

        /*=================================================== EXPRESS PASS*/
        const express_pass1 = new EmbedBuilder()
            .setColor(0x00ff00)
            .setAuthor({
                name: "Prince-Kun • Honkai Star Rail",
                iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("Express Pass is in Stock !")
            .setDescription(`\`\`\`HONKAI STAR RAIL - EXPRESS PASS\`\`\`` +
                `\`\`\`PRICE: ${price} INR/-\`\`\``)
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1337171003843018893/Express_Supply_Pass.png")
            .setFooter({
                text: `Price as of: ${new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                })} ${new Date().getHours() >= 12 ? "PM" : "AM"} | Prices may fluctuate at anytime 👈`,
                iconURL: interaction.user.displayAvatarURL({ extension: "png", size: 512 }),
            });

        const express_pass2 = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Read before purchasing")
            .setDescription(`Read <#1179353148482146404> before proceeding`);

        const express_pass3 = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("To Purchase")

            .setDescription(`Use <#1181972522900660264> to initiate an order or Message <@310672946316181514>`);

        /*=================================================== LUNITE SUBSCRIPTION*/
        const lunite_subscription1 = new EmbedBuilder()
            .setColor(0x00ff00)
            .setAuthor({
                name: "Prince-Kun • Wuthering Waves",
                iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("Lunite Subscription is in Stock !")
            .setDescription(`\`\`\`WUTHERING WAVES - LUNITE SUBSCRIPTION\`\`\`` +
                `\`\`\`PRICE: ${price} INR/-\`\`\``)
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1337171011216605297/Lunite_Subscription.png")
            .setFooter({
                text: `Price as of: ${new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                })} ${new Date().getHours() >= 12 ? "PM" : "AM"} | Prices may fluctuate at anytime 👈`,
                iconURL: interaction.user.displayAvatarURL({ extension: "png", size: 512 }),
            });

        const lunite_subscription2 = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Read before purchasing")
            .setDescription(`Read <#1242938772493176973> before proceeding`);

        const lunite_subscription3 = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("To Purchase")

            .setDescription(`Use <#1181972522900660264> to initiate an order or Message <@310672946316181514>`);

        /*=================================================== INTER-KNOT-SUBSCRIPTION*/
        const inter_knot_membership1 = new EmbedBuilder()
            .setColor(0x00ff00)
            .setAuthor({
                name: "Prince-Kun • Zenless Zone Zero",
                iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("Inter-Knot Membership is in Stock !")
            .setDescription(`\`\`\`ZENLESS ZONE ZERO - INTER-KNOT-SUBSCRIPTION\`\`\`` +
                `\`\`\`PRICE: ${price} INR/-\`\`\``)
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1337171008834113546/Inter-Knot_Membership.png")
            .setFooter({
                text: `Price as of: ${new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                })} ${new Date().getHours() >= 12 ? "PM" : "AM"} | Prices may fluctuate at anytime 👈`,
                iconURL: interaction.user.displayAvatarURL({ extension: "png", size: 512 }),
            });

        const inter_knot_membership2 = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Read before purchasing")
            .setDescription(`Read <#1337326717169307682> before proceeding`);

        const inter_knot_membership3 = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("To Purchase")

            .setDescription(`Use <#1181972522900660264> to initiate an order or Message <@310672946316181514>`);

        const embedsMap: Record<string, EmbedBuilder[]> = {
            "welkin": [welkin1, welkin2, welkin3],
            "express-pass": [express_pass1, express_pass2, express_pass3],
            "lunite-subscription": [lunite_subscription1, lunite_subscription2, lunite_subscription3],
            "inter-knot-membership": [inter_knot_membership1, inter_knot_membership2, inter_knot_membership3],
        };


        const embedsToSend = embedsMap[item];

        const channel = interaction.channel as TextChannel;
        if (embedsToSend) {
            await channel.send({
                content: `<@&${MarketUpdate}> <@&${StockUpdate}>`,
                embeds: embedsToSend,
            });
        }

        await interaction.reply({
            content: "✅ Stock information sent!",
            flags: 64,
        });
        console.log(
            chalk.underline(`[ INFO ]`) +
            "\n" +
            chalk.yellow(`User: ${userName}`) +
            "\n" +
            chalk.yellow(`Username: ${interaction.user.username}`) +
            "\n" +
            chalk.magenta(`Command: /game-items-stock`) +
            "\n" +
            chalk.cyan(`Location: ${location}`) +
            "\n" +
            chalk.green(`Message: Command executed successfully! : "${item}" at price ${price} INR/-\n`)
        );
    },
}

export default ShopItems;