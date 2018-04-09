const Command = require('detritus').CommandClient.Command;

class CustomCommand extends Command
{
	constructor(client)
	{
		super(client, {
			name: 'removethreshold',
			label: 'attribute',
			args: [
				{
					name: 'channel'
				},
				{
					name: 'guild'
				}
			],
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