import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { Command } from '../types/Command';
import chalk from 'chalk';

const pingCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with something Mambo!!'),
  async execute(interaction: ChatInputCommandInteraction) {
    const ownerId = interaction.guild?.ownerId;
    if (!interaction.guild) {
      await interaction.reply({
        content: '😂 Use it in a server, you idiot!',
        flags: 64,
      });
      return;
    }
    const member = interaction.member as GuildMember;
    const userName = member.displayName || interaction.user.username;
    if (interaction.user.id !== ownerId) {
      await interaction.reply({
        content:'https://media.tenor.com/suSxl49GmxsAAAAM/sonic-sonic-exe.gif',
        flags: 64,
        });
      await interaction.followUp({
        content: '🚫 You must be the server owner to use this command!',
        flags: 64, // Ephemeral flag
      });
      console.log(`[ INFO ]
User: ${userName}
Username: ${interaction.user.username}
Command: /ping
Message: Attempted to execute!\n`)
      return;
    }

    await interaction.reply('https://media.tenor.com/vn3L0I7IjR4AAAAM/uma-uma-musume.gif');
    console.log(`[ INFO ]
User: ${userName}
Username: ${interaction.user.username}
Command: /ping
Message: Successfully executed\n`)
  },
};

export default pingCommand;
