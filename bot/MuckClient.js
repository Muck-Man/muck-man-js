const Detritus = require('./lib');
const Utils = require('./Utils');

class MuckClient extends Detritus.Client
{
	constructor(options)
	{
		options = options || {};
		super(options.client);

		this.token = options.token;

		this.path = options.path || '';

		this.commandClient = new Detritus.CommandClient(options.commandClient, this);
	}

	request(options)
	{
		options = options || {};
		options.url = `https://muck.gg/api${options.url}`;
		options.headers = Object.assign(options.headers || {}, {Authorization: `Bot ${this.token}`});

		options.headers = Object.assign({}, options.headers, {Authorization: this.token});
		if (options.userId) {
			options.headers.Authorization = `${Buffer.from(options.userId).toString('base64')}.${options.headers.Authorization}`;
		}
		options.headers.Authorization = `Bot ${options.headers.Authorization}`;

		return this.rest.request(options);
	}

	run(options)
	{
		if (options && options.thirdPartyLaunch) {
			return super.run(options);
		}

		return new Promise((resolve, reject) => {
			if (!this.path) {
				return resolve();
			} else {
				this.commandClient.registerCommandsIn(this.path).then(resolve).catch(reject);
			}
		}).then(() => {
			this.commandClient.on('COMMAND_NONE', this.onNoCommand.bind(this));
			this.commandClient.on('COMMAND_FAIL', ({message, error}) => {});
			this.commandClient.on('COMMAND_RUN_SUCCESS', ({message, prefix, args, command}) => {});
			this.commandClient.on('COMMAND_RUN_FAIL', ({message, error, command}) => console.error('COMMAND_RUN_FAIL', error, command.name));
		}).then(() => {
			return this.commandClient.run(options);
		});
	}

	onNoCommand({message})
	{
		if (!message.content) {return;}

		const channel = message.channel;
		const guild = channel.guild;
		
		let logChannel;
		if (guild) {
			logChannel = guild.textChannels.find((c) => c.name === 'muck-logs');
		}

		this.request({
			method: 'post',
			url: '/muck',
			jsonify: true,
			body: {
				content: message.content,
				channel_id: channel.id,
				guild_id: (!channel.isDm) ? channel.guildId : null
			}
		}).then(({response, data}) => {
			const embed = {};
			const context = {
				user: message.author,
				content: message.content,
				timestamp: message.timestamp,
				channel
			};

			if ((data.channel && data.channel.passed) || (data.guild && data.guild.passed)) {
				message.delete().catch(console.error);

				if (data.channel && data.channel.passed) {
					context.thresholds = data.channel.thresholds;
					context.thresholdType = 'channel';
					context.thresholdContext = this.channels.get(data.channel.id);
				}

				if (data.guild && data.guild.passed) {
					context.thresholds = data.guild.thresholds;
					context.thresholdType = 'guild';
					context.thresholdContext = this.guilds.get(data.guild.id);
				}

				Object.assign(embed, Utils.Tools.formatMuck({is: 'log-delete', context}, data));
			} else {
				/*
				const body = {
					content: message.content,
					message_id: message.id,
					user_id: message.author.id,
					channel_id: channel.id,
					guild_id: (!channel.isDm) ? channel.guildId : null,
					timestamp: message.editedTimestampUnix || message.timestampUnix,
					edited: !!message.editedTimestamp
				};

				this.request({
					method: 'post',
					url: '/muck',
					query: {store: true},
					jsonify: true,
					body
				}).catch(console.error);
				*/
				Object.assign(embed, Utils.Tools.formatMuck({is: 'log', context}, data));
			}

			return logChannel && logChannel.createMessage({embed});
		}).catch(console.error);
	}
}

module.exports = MuckClient;