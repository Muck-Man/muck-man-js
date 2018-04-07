const Command = require('../lib').CommandClient.Command;

class CustomCommand extends Command
{
	constructor(client)
	{
		super(client, {
			name: 'ping'
		});
	}

	run(message, args)
	{
		return new Promise((resolve, reject) => {
			const promises = [this.client.rest.ping(), this.client.gateway.ping()];
			Promise.all(promises).then(resolve).catch(reject);
		}).then(([rping, gping]) => {
			return message.reply(`pong! (rest: ${rping}ms) (gateway: ${gping}ms)`);
		}, (e) => {
			return message.reply(`error pinging: ${e.message}`);
		});
	}
}

module.exports = CustomCommand;