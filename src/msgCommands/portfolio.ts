import { Message, EmbedBuilder } from "discord.js";
import { PortfolioLink } from "../utility/utils";
import { COLOR_PRIMARY } from "../utility/uuid/Colors";

export default {
    triggers: [".?portfolio"],

    async execute(message: Message) {
        const embed = new EmbedBuilder()
            .setColor(COLOR_PRIMARY)
            .setDescription(PortfolioLink);

        await message.reply({ embeds: [embed] });
    },
};
