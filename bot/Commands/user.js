const Command = require('detritus').CommandClient.Command;

const Utils = require('../Utils');

class CustomCommand extends Command
{
	constructor(client)
	{
		super(client, {
			name: 'user',
			aliases: ['userstats', 'userinfo'],
			args: [
				{
					name: 'guild'
				},
				{
					name: 'channel'
				},
				{
					name: 'strict',
					type: 'bool',
					default: false
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
		const channel = message.channel;

		return new Promise((resolve, reject) => {
			let user;
			if (args.user) {
				const match = args.user.match(/^<@!?(\d+)>$/);
				if (match) {
					user = this.client.users.get(match[1]);
				} else {
					if (this.client.users.has(args.user)) {
						user = this.client.users.get(args.user);
					} else {
						const find = {
							username: args.user,
							discriminator: null
						};
			
						if (!args.strict) {
							find.username = find.username.toLowerCase();
						}

						if (~find.username.indexOf('#')) {
							find.username = find.username.split('#');
							find.discriminator = ('0000' + find.username.pop()).slice(-4)
							find.username = find.username.join('');
						}

						const member = (!channel.isDm) ? channel.guild.members.find((member) => {
							if (member.bot) {return;}

							let search;
							if (find.discriminator) {
								search = (member.discriminator === find.discriminator);
								if (args.strict) {
									search = (search && member.username === find.username);
								} else {
									search = (search && member.username.toLowerCase().includes(find.username));
								}
							} else {
								search = [member.username, member.nick].some((name) => {
									if (args.strict) {
										return (name && name === find.username);
									} else {
										return (name && name.toLowerCase().includes(find.username));
									}
								});
							}
							return search;
						}) : null;

						if (member) {
							user = member.user;
						} else {
							const suser = this.client.users.find((u) => {
								if (u.bot) {return;}
								let search = (!find.discriminator || u.discriminator === find.discriminator);
								if (args.strict) {
									search = (search && u.username === find.username);
								} else {
									search = (search && u.username.toLowerCase().includes(find.username));
								}
								return search;
							});

							user = suser;
						}
					}
				}
			} else {
				user = message.author;
			}

			if (!user) {
				return reject(new Error('user not found'));
			}

			if (user.bot) {
				return reject(new Error('cannot see stats of bots, sorry bud'));
			}

			if (args.channel && args.guild) {
				return reject(new Error('cannot use both guild and channel'));
			}

			let type = 'global';
			let context;
			if (args.channel) {
				let channelid = args.channel;
				const match = channelid.match(/^<#(\d+)>/);
				if (match) {
					channelid = match[1];
				}
				if (!this.client.channels.has(channelid)) {
					return reject(new Error('no channel found'));
				} else {
					context = this.client.channels.get(channelid);
					type = 'channel';
				}
			}

			if (args.guild) {
				if (!this.client.guilds.has(args.guild)) {
					return reject(new Error('no guild found'));
				} else {
					context = this.client.guilds.get(args.guild);
					type = 'guild';
				}
			}

			resolve({user, type, context});
		}).then(({user, type, context}) => {
			const query = {};
			if (context) {
				query.context_id = context.id;
				query.context_type = `${type}s`;
			}
			return this.client.request({
				method: 'get',
				url: `/muck/stats/users/${user.id}`,
				query
			}).then(({response, data}) => {
				return Utils.Tools.formatMuck({
					is: 'user',
					context: {user, type, context}
				}, data);
			}, (e) => {
				if (!e.response) {return Promise.reject(e);}
				return Utils.Tools.formatMuck({
					is: 'user',
					context: {user, type, context},
					error: e.response.data
				});
			}).then((embed) => {
				return message.reply({embed});
			});
		}).catch((e) => {
			return message.reply(e.message);
		})
	}
}

module.exports = CustomCommand;