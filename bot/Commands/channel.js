const Command = require('detritus').CommandClient.Command;

const Utils = require('../Utils');

class CustomCommand extends Command
{
	constructor(client)
	{
		super(client, {
			name: 'channel',
			aliases: ['channelstats', 'channelinfo'],
			args: [],
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
			let channel;
			if (args.channel) {
				if (!this.client.channels.has(args.channel)) {
					return reject(new Error('channel not found lol'));
				} else {
					channel = this.client.channels.get(args.channel);
				}
			} else {
				channel = message.channel;
			}

			resolve(channel);
		}).then((channel) => {
			return this.client.request({
				method: 'get',
				url: `/muck/stats/channels/${channel.id}`
			}).then(({response, data}) => {
				return Utils.Tools.formatMuck({
					is: 'channel',
					context: channel
				}, data);
			}, (e) => {
				if (!e.response) {return Promise.reject(e);}
				return Utils.Tools.formatMuck({
					is: 'channel',
					context: channel,
					error: e.response.data
				});
			}).then((embed) => {
				return message.reply({embed});
			});
		}, (e) => {
			return message.reply(e.message);
		});
	}
}

module.exports = CustomCommand;