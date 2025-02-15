import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType,
    GuildMember,
} from "discord.js";
import moment from "moment-timezone";
import pool from "../db";
import { Command } from "../types/Command";
import { logger_custom } from "../utility/logger-custom";
import { ItsMePrinceRules } from "../utility/itsmeprince-rules";

const registerCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Register your profile for ItsMe Prince Shop."),

    async execute(interaction: ChatInputCommandInteraction) {
        const userId = interaction.user.id;
        const member = interaction.member as GuildMember;
        const userName = member?.displayName || interaction.user.username;

        const [rows]: any = await pool.query("SELECT user_id FROM users WHERE user_id = ?", [userId]);

        if (rows.length > 0) {
            await interaction.reply({
                content: "❌ You are already registered!",
                flags: 64,
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle("ItsMe Prince Shop - Registration")
            .setThumbnail(interaction.user.displayAvatarURL())
            .setDescription(ItsMePrinceRules + `**You accept the rules by registering and you also agree to any future updates or changes in the value of PP CASH. It is your responsibility to stay updated with the latest rules.**`
            )
            .setColor(0x006eff);

        const registerButton = new ButtonBuilder()
            .setCustomId(`register_${userId}`)
            .setLabel("Accept & Register")
            .setStyle(ButtonStyle.Success);

        const cancelButton = new ButtonBuilder()
            .setCustomId(`cancel_${userId}`)
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(registerButton, cancelButton);

        const reply = await interaction.reply({
            embeds: [embed],
            components: [row]
        });

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 30000,
            filter: (buttonInteraction) => buttonInteraction.user.id === userId
        });

        collector.on("collect", async (buttonInteraction) => {
            if (buttonInteraction.customId === `register_${userId}`) {
                const istTime = moment.tz("Europe/Paris").tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
                await pool.query(
                    "INSERT INTO users (user_id, pp_cash, refer_tickets, total_purchases, registration_date) VALUES (?, ?, ?, ?, ?)",
                    [userId, 0, 0, 0, istTime]
                );

                const MessageString = `[ DATABASE ] User ${userName} (${userId}) registered`;
                logger_custom(userName, "profile", MessageString);

                await buttonInteraction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Registration Successful!")
                            .setThumbnail(interaction.user.displayAvatarURL())
                            .setDescription("Well, you're registered!\n Use \`/profile\` to check your inventory!\n\n**Current Marketplace:** https://discord.com/channels/310675536340844544/1177928471951966339/1179354261365211218")
                            .setColor(0x00ff00)
                    ],
                    components: []
                });
            } else if (buttonInteraction.customId === `cancel_${userId}`) {
                console.log(`[ INFO ] User ${userName} (${userId}) cancelled registration.`);

                await buttonInteraction.update({
                    content: "Registration cancelled.",
                    components: []
                });
            }
        });

        collector.on("end", async () => {
            try {
                await interaction.editReply({ components: [] });
            } catch (error) {
                console.error(`[ ERROR ] Failed to edit reply after collector ended: ${error}`);
            }
        });
    }
};


export default registerCommand;
