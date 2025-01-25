import { Client, Collection } from 'discord.js';

export class ExtendedClient extends Client {
    commands: Collection<string, any> = new Collection();
}
