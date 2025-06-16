import { EmbedBuilder, User } from "discord.js";
import { COLOR_TRUE } from '../uuid/Colors';

export function getRegistrationSuccessEmbed(user: User): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(COLOR_TRUE)
        .setTitle("Registration Successful !")
        .setThumbnail(user.displayAvatarURL())
        .setDescription(
            `Well then, <@${user.id}>, you're registered!\nUse \`/profile\` or \`.?profile\` to check your inventory!\n\n**Current Marketplace:** [Join Server](https://discord.gg/spHgh4PGzF) • https://discord.com/channels/310675536340844544/1177928471951966339/1179354261365211218`
        )
        .setTimestamp();
}