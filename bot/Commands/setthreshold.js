const Detritus = require('detritus');

const Command = require('detritus').CommandClient.Command;

class CustomCommand extends Command
{
	constructor(client)
	{
		super(client, {
			name: 'setthreshold',
			label: 'attribute',
			args: [{name: 'amount'}, {name: 'guild'}, {name: 'channel'}],
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
			if (!args.attribute) {return reject(new Error('Attribute missing'));}
			if (!args.amount) {return reject(new Error('Amount missing'));}

			if (args.guild && args.channel) {return reject(new Error('Both Guild and Channel cannot be specified.'));}
			
			let amount;
			if (~args.amount.indexOf('%')) {
				amount = args.amount.replace(/%/g, '');
			}

			amount = parseFloat(amount);
			if (isNaN(amount)) {
				return reject(new Error('Amount is not a number'));
			}

			amount = Math.max(0, Math.min(amount / 100, 100));

			const attribute = args.attribute.replace(/ /g, '_');
			const context = {};
			if (!args.guild && !args.channel) {
				context.type = 'channels';
				context.id = message.channelId;
			} else {
				if (args.guild) {
					context.type = 'guilds';
					context.id = args.guild;
				} else {
					const match = Detritus.Utils.Tools.regex('channel', args.channel);
					if (match) {
						context.id = match.id;
					} else {
						context.id = args.channel;
					}
					context.type = 'channels';
				}
			}

			const body = {};
			body[attribute] = amount;
			return this.client.request({
				method: 'put',
				url: `/muck/thresholds/${context.type}/${context.id}`,
				jsonify: true,
				body
			}).then(({response, data}) => {
				return message.reply(`set ${attribute} threshold to ${(amount * 100).toFixed(2)}% in ${context.type.slice(0, -1)} <${context.id}>`);
			}).catch((e) => {
				if (!e.response) {return Promise.reject(e);}
				return message.reply(e.response.data.message);
			});
		}).catch((e) => {
			return message.reply(e.message);
		});
	}
}

module.exports = CustomCommand;