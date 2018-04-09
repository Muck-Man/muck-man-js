const Command = require('../lib').CommandClient.Command;

const Utils = require('../Utils');

class CustomCommand extends Command
{
	constructor(client)
	{
		super(client, {
			name: 'guild',
			aliases: ['guildstats', 'guildinfo'],
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
			const channel = message.channel;

			let guild;
			if (args.guild) {
				if (!this.client.guilds.has(args.guild)) {
					return reject(new Error('guild not found lol'));
				} else {
					guild = this.client.guilds.get(args.guild);
				}
			} else {
				if (channel.isDm) {
					return reject(new Error('please specify a guild id'));
				} else {
					guild = message.guild;
				}
			}

			resolve(guild);
		}).then((guild) => {
			return this.client.request({
				method: 'get',
				url: `/muck/stats/guilds/${guild.id}`
			}).then(({response, data}) => {
				return Utils.Tools.formatMuck({
					is: 'guild',
					context: guild
				}, data);
			}, (e) => {
				if (!e.response) {return Promise.reject(e);}
				return Utils.Tools.formatMuck({
					is: 'guild',
					context: guild,
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