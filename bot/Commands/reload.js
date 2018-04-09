const Command = require('../lib').CommandClient.Command;

const Utils = require('../Utils');

class CustomCommand extends Command
{
	constructor(client)
	{
		super(client, {
			name: 'reload',
			aliases: ['reloadcommands', 'reloadcmds'],
			ratelimit: {
				limit: 5,
				duration: 5
			}
		});
	}

	run(message, args)
	{
		return new Promise((resolve, reject) => {
			this.client.request({
				method: 'get',
				url: `/users/@me`,
				userId: message.author.id
			}).then(({response, data}) => {
				if (!Utils.Permissions.check(data.permissions, 'OWNER')) {
					return reject();
				}
				resolve(data);
			}).catch(reject);
		}).then((user) => {
			this.commandClient.clearCommands();
			return (this.client.path) ? this.commandClient.registerCommandsIn(this.client.path) : null;
		}, (e) => {
			return message.reply('Invalid Permissions');
		}).then(() => {
			return message.reply('ok done');
		}).catch((e) => {
			return message.reply(e.message);
		});
	}
}

module.exports = CustomCommand;