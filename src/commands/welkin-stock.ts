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

const WelkinStock: Command = {
    data: new SlashCommandBuilder()
        .setName("welkin-stock")
        .setDescription("Sends an embed about Genshin Impact's Welkin Moon Stock.")
        .addNumberOption((option: any) =>
            option.setName("price")
                .setDescription("Enter the price of Welkin")
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
                chalk.magenta(`Command: /welkin-stock`) +
                "\n" +
                chalk.cyan(`Location: ${location}`) +
                "\n" +
                chalk.red(`Message: Unauthorized user attempted to execute!\n`)
            );
            return;
        }

        const price = interaction.options.getNumber("price", true);
        const embed1 = new EmbedBuilder()
            .setColor(0x00ff00)
            .setAuthor({
                name: "Prince-Kun • Genshin Impact",
                iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
            })
            .setTitle("Blessing of the Welkin Moon is in Stock !")
            .setDescription(`\`\`\`GENSHIN IMPACT - BLESSING OF THE WELKIN MOON\`\`\`` +
                `\`\`\`PRICE: ${price}\`\`\``)
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1337171003356221461/Blessing_of_the_Welkin.png")
            .setFooter({
                text: `Price as of: ${new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                })} ${new Date().getHours() >= 12 ? "PM" : "AM"} | Prices may fluctuate at anytime 👈`,
                iconURL: interaction.user.displayAvatarURL({ extension: "png", size: 512 }),
            });

        const embed2 = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Read before purchasing")
            .setDescription(`Read <#1177928702114406481> before proceeding`);

        const embed3 = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("To Purchase")

            .setDescription(`Use <#1181972522900660264> to initiate an order or Message <@310672946316181514>`);


        const channel = interaction.channel as TextChannel;

        await channel.send({
            content: `<@&${MarketUpdate}> <@&${StockUpdate}>`,
            embeds: [embed1, embed2, embed3],
        });

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
            chalk.magenta(`Command: /welkin-stock`) +
            "\n" +
            chalk.cyan(`Location: ${location}`) +
            "\n" +
            chalk.green(`Message: Command executed successfully!\n`)
        );
    },
};

export default WelkinStock;
