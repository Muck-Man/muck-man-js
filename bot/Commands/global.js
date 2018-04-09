const Command = require('detritus').CommandClient.Command;

const Utils = require('../Utils');

class CustomCommand extends Command
{
	constructor(client)
	{
		super(client, {
			name: 'global',
			aliases: ['globalstats', 'globalinfo'],
			ratelimit: {
				limit: 5,
				duration: 5,
				type: 'guild'
			}
		});
	}

	run(message, args)
	{
		return new Promise((resolve, reject) => {
			this.client.request({
				method: 'get',
				url: '/muck/stats'
			}).then(({response, data}) => {
				return Utils.Tools.formatMuck({is: 'global'}, data);
			}, (e) => {
				if (!e.response) {return Promise.reject(e);}
				return Utils.Tools.formatMuck({is: 'global', error: e.response.data});
			}).then(resolve).catch(reject);
		}).then((embed) => {
			return message.reply({embed});
		}).catch((e) => {
			return message.reply(e.message);
		});
	}
}

module.exports = CustomCommand;