const Command = require('../lib').CommandClient.Command;

class CustomCommand extends Command
{
	constructor(client)
	{
		super(client, {
			name: 'setthreshold',
			label: 'attribute',
			args: [
				{
					name: 'amount'
				},
				{
					name: 'guild'
				},
				{
					name: 'channel'
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
		return new Promise((resolve, reject) => {
			if (!args.attribute) {return reject(new Error('Attribute missing'));}
			if (!args.amount) {return reject(new Error('Amount missing'));}

			if (args.guild && args.channel) {return reject(new Error('Both Guild and Channel cannot be specified.'));}
			
			let amount;
			if (~args.amount.indexOf('%') || !~args.amount.indexOf('.')) {
				amount = parseInt(args.amount.replace(/%/g, ''));
				if (!isNaN(amount)) {
					amount = amount / 100;
				}
			} else {
				amount = parseFloat(args.amount);
			}
			if (isNaN(amount)) {
				return reject(new Error('Amount is not a number'));
			}

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
					context.type = 'channels';
					context.id = args.channel;
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
				return message.reply(`set ${attribute} threshold to ${amount * 100}% in ${context.type.slice(0, -1)} <${context.id}>`);
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