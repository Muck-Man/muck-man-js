const Command = require('detritus').CommandClient.Command;

class CustomCommand extends Command
{
	constructor(client)
	{
		super(client, {
			name: 'help',
			ratelimit: {
				limit: 5,
				duration: 5,
				type: 'guild'
			}
		});
	}

	run(message, args)
	{
		return message.reply('**muck man**\n\n<https://muck.gg/>');
	}
}

module.exports = CustomCommand;