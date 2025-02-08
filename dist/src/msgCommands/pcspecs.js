"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const pc_specs_1 = require("../utility/pc-specs");
exports.default = {
    triggers: [".?pcspecs", ".?specs", ".?specifications", ".?pc", ".?pppc"],
    async execute(message) {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(0xc200ff)
            .setAuthor({
            name: "Prince-Kun • PC Specs",
            iconURL: "https://media.discordapp.net/attachments/1336322293437038602/1336322635939975168/Profile_Pic_2.jpg",
        })
            .setTitle("Setup Specifications")
            .setDescription(pc_specs_1.SPECS)
            .setImage("https://media.discordapp.net/attachments/1336322293437038602/1337045537374867507/Pc_Specs.png")
            .setFooter({
            text: `${message.author.username} | ${new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
            })} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
            iconURL: message.author.displayAvatarURL(),
        });
        await message.reply({ embeds: [embed] });
    },
};
