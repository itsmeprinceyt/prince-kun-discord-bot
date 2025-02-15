import {
    ModalSubmitInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ButtonInteraction,
    TextInputBuilder,
    TextInputStyle,
    ModalBuilder,
} from "discord.js";
import pool from "../db";
import moment from "moment-timezone";
import { logger_custom } from "../utility/logger-custom";
import { EMOTES } from "../utility/emotes";
const GC = EMOTES[0].roleId;
const YC = EMOTES[1].roleId;
const RC = EMOTES[2].roleId;
const BC = EMOTES[3].roleId;
const PC = EMOTES[4].roleId;

export async function handleSelectUser(interaction: ButtonInteraction) {
    logger_custom("ADMIN", "admin", "Admin clicked select user button");

    const modal = new ModalBuilder().setCustomId("select_user").setTitle("Select User")
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder().setCustomId("user_index").setLabel("Enter user serial number:").setStyle(TextInputStyle.Short)
            )
        );

    await interaction.showModal(modal);
}

export async function handleSelectUserSubmit(interaction: ModalSubmitInteraction) {
    logger_custom("ADMIN", "admin", "Admin submitted select user modal");

    const [users]: any = await pool.query("SELECT user_id FROM users");
    const userIndex = parseInt(interaction.fields.getTextInputValue("user_index")) - 1;

    if (isNaN(userIndex) || userIndex < 0 || userIndex >= users.length) {
        await interaction.reply({ content: "❌ Invalid serial number!", flags: 64 });
        return;
    }

    const selectedUser = users[userIndex];
    const selectedUserId = selectedUser.user_id;
    const selectedDiscordUser = await interaction.client.users.fetch(selectedUserId).catch(() => null);

    let selectedUsername = "Unknown User";
    let selectedDisplayName = "Unknown Name";
    let selectedAvatar = interaction.client.user.displayAvatarURL(); // Default bot avatar in case of errors

    if (selectedDiscordUser) {
        selectedUsername = selectedDiscordUser.username;
        selectedDisplayName = selectedDiscordUser.globalName || selectedUsername;
        selectedAvatar = selectedDiscordUser.displayAvatarURL();
    }
    const [userData]: any = await pool.query(
        "SELECT pp_cash, refer_tickets, total_purchases, registration_date, total_referred FROM users WHERE user_id = ?",
        [selectedUser.user_id]
    );

    if (userData.length === 0) {
        await interaction.reply({ content: "❌ User data not found!", flags: 64 });
        return;
    }

    const { pp_cash, refer_tickets, total_purchases, registration_date, total_referred } = userData[0];
    const AA = String(pp_cash).padEnd(8, " ");
    const BB = String(refer_tickets).padEnd(8, " ");
    const CC = String(total_purchases).padEnd(8, " ");
    const DD = String(total_referred).padEnd(8, " ");
    const formattedDate = moment(registration_date)
        .tz("Asia/Kolkata", true)
        .format("DD MMM YYYY, hh:mm A");
    logger_custom("ADMIN", "admin", `Selected user: ${selectedUser.user_id}`);

    const userEmbed = new EmbedBuilder()
        .setColor(0xeeff00)
        .setTitle("ItsMe Prince - Profile")
        .setAuthor({
            name: "Prince-Kun • Profile Info",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
        .setThumbnail(selectedAvatar)
        .setTitle("ItsMe Prince Shop")
        .setDescription(
`${YC} **Name:** <@${selectedUser.user_id}>\n` +
`${YC} **Username:** ${selectedUsername}\n` +
`${YC} **UserID:** ${selectedUser.user_id}\n` +
`${YC} **Registered on:** ${formattedDate}\n\n` +

`**Stats**\n` +
`${YC} \`PP Cash          \` • \`${AA}\`\n` +
`${YC} \`Referral Tickets \` • \`${BB}\`\n` +
`${YC} \`Total Purchases  \` • \`${CC}\`\n` +
`${YC} \`Total Referred   \` • \`${DD}\`\n\n` +

`**Extra**\n` +
`${GC} \`1 PP Cash = 1₹\`\n` +
`${GC} To know rules & information, type \`.?shoprules\``)
        .setFooter({
            text: `${selectedUsername} | ${new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Kolkata",
            })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
            iconURL: selectedAvatar,
        });

    const userRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId(`modify_ppCash_${selectedUser.user_id}`).setLabel("💰 Modify PP Cash").setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`modify_referral_${selectedUser.user_id}`).setLabel("🎟 Modify Referral Tickets").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId(`modify_purchases_${selectedUser.user_id}`).setLabel("🛒 Modify Purchases").setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`modify_referred_${selectedUser.user_id}`).setLabel("👥 Modify Total Referred").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId(`delete_${selectedUser.user_id}`).setLabel("❌ Delete User").setStyle(ButtonStyle.Danger)
    );


    await interaction.reply({ embeds: [userEmbed], components: [userRow], flags: 64 });
}

export async function handleModifyPP(interaction: ButtonInteraction) {
    logger_custom("ADMIN", "admin", "Admin clicked modify PP cash button");
    const userId = interaction.customId.split("_")[2];

    const modal = new ModalBuilder()
        .setCustomId(`modify_ppCash_${userId}`)
        .setTitle("Modify PP Cash")
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId("new_ppCash")
                    .setLabel("Enter new PP Cash:")
                    .setStyle(TextInputStyle.Short)
            )
        );

    await interaction.showModal(modal);
}

export async function handleModifyReferral(interaction: ButtonInteraction) {
    logger_custom("ADMIN", "admin", "Admin clicked modify referral tickets button");
    const userId = interaction.customId.split("_")[2];

    const modal = new ModalBuilder()
        .setCustomId(`modify_referral_${userId}`)
        .setTitle("Modify Referral Tickets")
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId("new_referral_tickets")
                    .setLabel("Enter new referral tickets:")
                    .setStyle(TextInputStyle.Short)
            )
        );

    await interaction.showModal(modal);
}

export async function handleModifyPurchases(interaction: ButtonInteraction) {
    logger_custom("ADMIN", "admin", "Admin clicked modify total purchases button");
    const userId = interaction.customId.split("_")[2];

    const modal = new ModalBuilder()
        .setCustomId(`modify_purchases_${userId}`)
        .setTitle("Modify Total Purchases")
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId("new_total_purchases")
                    .setLabel("Enter new total purchases:")
                    .setStyle(TextInputStyle.Short)
            )
        );

    await interaction.showModal(modal);
}

export async function handleModifyReferred(interaction: ButtonInteraction) {
    logger_custom("ADMIN", "admin", "Admin clicked modify total referred button");
    const userId = interaction.customId.split("_")[2];

    const modal = new ModalBuilder()
        .setCustomId(`modify_referred_${userId}`)
        .setTitle("Modify Total Referred")
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId("new_total_referred")
                    .setLabel("Enter new Total Referred:")
                    .setStyle(TextInputStyle.Short)
            )
        );

    await interaction.showModal(modal);
}


export async function handleModifySubmit(interaction: ModalSubmitInteraction) {
    logger_custom("ADMIN", "admin", "Admin submitted modify modal");
    const parts = interaction.customId.split("_");
    const type = parts[1];
    const userId = parts[2];

    let field, inputValue, updateField;
    if (type === "ppCash") {
        field = "new_ppCash";
        updateField = "pp_cash";
    } else if (type === "referral") {
        field = "new_referral_tickets";
        updateField = "refer_tickets";
    } else if (type === "purchases") {
        field = "new_total_purchases";
        updateField = "total_purchases";
    } else if (type === "referred") { // Added total referred
        field = "new_total_referred";
        updateField = "total_referred";
    } else {
        await interaction.reply({ content: "❌ Invalid action!", flags: 64 });
        return;
    }

    inputValue = interaction.fields.getTextInputValue(field).trim();
    const newValue = Number(inputValue);
    if (isNaN(newValue)) {
        await interaction.reply({ content: "❌ Invalid value entered!", flags: 64 });
        return;
    }

    const [result] = await pool.query(`UPDATE users SET ${updateField} = ? WHERE user_id = ?`, [newValue, userId]);
    console.log("[DEBUG] Database Update Result:", result);
    logger_custom("ADMIN", "admin", `Updated ${updateField} for user ${userId} to ${newValue}`);

    await interaction.reply({ content: `✅ **${updateField.replace("_", " ").toUpperCase()}** updated to **${newValue}**!`, flags: 64 });
}


export async function handleDeleteUser(interaction: ButtonInteraction) {
    logger_custom("ADMIN", "admin", "Admin clicked delete user button");
    const userId = interaction.customId.split("_")[1];

    await pool.query("DELETE FROM users WHERE user_id = ?", [userId]);
    logger_custom("ADMIN", "admin", `Deleted user ${userId}`);

    await interaction.reply({ content: `🗑️ User <@${userId}> has been deleted.`, flags: 64 });
}
