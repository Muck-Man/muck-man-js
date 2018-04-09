const Command = require('../lib').CommandClient.Command;

const Utils = require('../Utils');

class CustomCommand extends Command
{
	constructor(client)
	{
		super(client, {
			name: 'analyze',
			label: 'content',
			aliases: ['analyse'],
			args: [],
			ratelimit: {
				limit: 10,
				duration: 5,
				type: 'guild'
			}
		});
	}

	run(message, args)
	{
		if (!args.content) {return;}

		return new Promise((resolve, reject) => {
			this.client.request({
				method: 'post',
				url: '/muck',
				body: {content: args.content},
				jsonify: true
			}).then(({response, data}) => {
				return Utils.Tools.formatMuck({
					is: 'analyze',
					context: {
						user: message.author,
						content: args.content
					}
				}, data);
			}, (e) => {
				if (!e.response) {return Promise.reject(e);}
				return Utils.Tools.formatMuck({
					is: 'analyze',
					context: {
						user: message.author,
						content: args.content
					},
					error: e.response.data
				});
			}).then(resolve).catch(reject);
		}).then((embed) => {
			return message.reply({embed});
		}).catch((e) => {
			return message.reply(e.message);
		});
	}
}

module.exports = CustomCommand;