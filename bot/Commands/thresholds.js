const Command = require('../lib').CommandClient.Command;

class CustomCommand extends Command
{
	constructor(client)
	{
		super(client, {
			name: 'thresholds',
			label: 'channel',
			ratelimit: {
				limit: 5,
				duration: 5,
				type: 'guild'
			}
		});
	}

	run(message, args)
	{
		return message.reply('wip');
	}
}

module.exports = CustomCommand;