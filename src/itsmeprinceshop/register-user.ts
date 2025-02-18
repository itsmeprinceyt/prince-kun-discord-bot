import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    GuildMember,
    PermissionFlagsBits,
    User,
} from "discord.js";
import moment from "moment-timezone";
import pool from "../db";
import { Command } from "../types/Command";
import { logger_custom } from "../utility/logger-custom";
import { ItsMePrinceRules } from "../utility/itsmeprince-rules";
import { RolesPerms } from "../utility/rolePerms";
const adminId = RolesPerms[5].roleId;

const registerUserCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("register-user")
        .setDescription("Register a user in the database.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The user to register")
                .setRequired(true)
        ) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guild && interaction.user.id !== adminId) {
            await interaction.reply("This is a Server-Only Command! 🖕");
            return;
        }

        if (interaction.guild && !interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
            await interaction.reply({
                content: "❌ Only administrators can use this command!",
                flags: 64,
            });
            return;
        }

        const selectedUser = interaction.options.getUser("user") as User;
        const selectedMember = interaction.guild?.members.cache.get(selectedUser.id) as GuildMember;
        const userName = selectedMember?.displayName || selectedUser.username;

        const [rows]: any = await pool.query("SELECT user_id FROM users WHERE user_id = ?", [selectedUser.id]);

        if (rows.length > 0) {
            await interaction.reply({
                content: `❌ ${userName} is already registered!`,
                flags: 64,
            });
            return;
        }

        const istTime = moment.tz("Europe/Paris").tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
        await pool.query(
            "INSERT INTO users (user_id, pp_cash, refer_tickets, total_purchases, registration_date, total_referred) VALUES (?, ?, ?, ?, ?, ?)",
            [selectedUser.id, 0, 0, 0, istTime, 0]
        );

        const logMessage = `[ DATABASE ] User ${userName} (${selectedUser.id}) registered by Admin ${interaction.user.username}`;
        logger_custom(userName, "register", logMessage);

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Registration Successful !")
            .setThumbnail(selectedUser.displayAvatarURL())
            .setDescription(`Well then, <@${selectedUser.id}>, you're registered!\n Use \`/profile\` to check your inventory!\n\n**Current Marketplace:** https://discord.com/channels/310675536340844544/1177928471951966339/1179354261365211218`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};

export default registerUserCommand;
