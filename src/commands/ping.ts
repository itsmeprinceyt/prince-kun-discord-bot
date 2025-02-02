import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../types/Command';

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

    if (interaction.user.id !== ownerId) {
      await interaction.reply({
        content: '🚫 You must be the server owner to use this command!',
        flags: 64,
      });
      return;
    }

    await interaction.reply('https://media.tenor.com/vn3L0I7IjR4AAAAM/uma-uma-musume.gif');
  },
};

export default pingCommand;
