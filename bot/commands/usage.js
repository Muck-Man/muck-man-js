const Command = require('../lib').CommandClient.Command;

const Utils = require('../Utils');

class CustomCommand extends Command
{
	constructor(client)
	{
		super(client, {
			name: 'usage',
			ratelimit: {
				limit: 10,
				duration: 5,
				type: 'guild'
			}
		});
	}

	run(message, args)
	{
		return message.reply(['```json', JSON.stringify({
			uptime: Utils.Tools.formatTime(process.uptime() * 1000, {ms: true}),
			memory: Utils.Tools.formatMemory(process.memoryUsage().heapUsed),
			messages: this.client.messages.size,
			guilds: this.client.guilds.size,
			channels: this.client.channels.size,
			users: this.client.users.size,
			members: this.client.members.size,
			emojis: this.client.emojis.size,
			presences: this.client.presences.size,
			actualPresences: this.client.presences.actualSize,
			voiceStates: this.client.voiceStates.size
		}, null, 2), '```'].join('\n'));
	}
}

module.exports = CustomCommand;