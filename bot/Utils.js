const Detritus = require('./lib');

module.exports = {
	formatMuck: (info, data) => {
		const color = {r: 0, g: 0, b: 0};

		if (data) {
			color.r = parseInt(255 * data.scores.toxicity);
			color.g = parseInt(255 * (1 - data.scores.toxicity));
			
			if (color.r > color.g) {
				color.b = 71;
			} else {
				color.b = 129;
			}
		}

		const embed = {
			author: {
				url: 'https://muck.gg'
			},
			color: Detritus.Utils.Tools.rgbToInt(color.r, color.g, color.b),
			fields: [],
			footer: {}
		};

		if (info.error) {
			embed.footer.text = `Error: ${info.error.message}`;
		} else {
			Object.keys(data.scores).sort().forEach((key) => {
				embed.fields.push({
					name: key.toLowerCase().split('_').map((t) => t.charAt(0).toUpperCase() + t.substr(1)).join(' '),
					value: `${(data.scores[key] * 100).toFixed(2)}%`,
					inline: true
				});
			});
		}

		switch (info.is) {
			case 'guild': {
				embed.author.name = info.context.toString();
				embed.author.iconURL = info.context.iconURL;
				if (!info.error) {
					embed.footer.text = `Analyzed ${data.count.toLocaleString()} messages | Started analyzing`;
					embed.timestamp = (new Date(data.started * 1000)).toISOString();
				}
			}; break;
			case 'channel': {
				embed.author.name = `${info.context.toString()} (${info.context.id})`;
				if (!info.error) {
					embed.footer.text = `Analyzed ${data.count.toLocaleString()} messages | Started analyzing`;
					embed.timestamp = (new Date(data.started * 1000)).toISOString();
				}
			}; break;
			case 'user': {
				const context = info.context;
				embed.author.name = `${context.user.toString()} (${context.user.id})`;
				embed.author.icon_url = context.user.avatarURL;
				embed.description = [
					`User's ${context.type.charAt(0).toUpperCase() + context.type.substring(1).toLowerCase()} Stats`,
					context.context && `${context.context.toString()} (${context.context.id})`
				].filter((v) => v).join('\n');
				if (!info.error) {
					embed.footer.text = `Analyzed ${data.count.toLocaleString()} messages | Started analyzing`;
					embed.timestamp = (new Date(data.started * 1000)).toISOString();
				}
			}; break;
			case 'global': {
				embed.author.name = 'Global Stats';
				if (!info.error) {
					embed.footer.text = `Analyzed ${data.count.toLocaleString()} messages | Started analyzing`;
					embed.timestamp = (new Date(data.started * 1000)).toISOString();
				}
			}; break;
			case 'analyze': {
				embed.author.name = `${info.context.user.toString()} (${info.context.user.id})`;
				embed.author.icon_url = info.context.user.avatarURL;
				embed.title = 'Content';
				embed.description = info.context.content;
				if (!info.error) {
					embed.footer.text = 'Muck Man';
				}
			}; break;
		}

		return embed;
	},
	formatMemory: (bytes, decimals) => {
		decimals = decimals || 0;
		const divideBy = 1024;
		const amount = Math.floor(Math.log(bytes) / Math.log(divideBy));
		const type = (['B', 'KB', 'MB','GB', 'TB'])[amount];
		return parseFloat(bytes / Math.pow(divideBy, amount)).toFixed(decimals) + ' ' + type;
	},
	formatTime: (ms, options) => {
		options = Object.assign({}, options);
		options.day = (options.day === undefined) ? true : false;
		options.ms = options.ms || false;
	
		let days, hours, minutes, seconds, milliseconds;
		seconds = Math.floor(ms / 1000);
		minutes = Math.floor(seconds / 60);
		seconds = seconds % 60;
		hours = Math.floor(minutes / 60);
		minutes = minutes % 60;
		days = Math.floor(hours / 24);
		hours = hours % 24;
		milliseconds = ms % 1000;
	
	
		days = (days) ? `${days}d` : null;
		hours = (`0${hours}`).slice(-2);
		minutes = (`0${minutes}`).slice(-2);
		seconds = (`0${seconds}`).slice(-2);
		milliseconds = (`00${milliseconds}`).slice(-3);
	
		let time = `${hours}:${minutes}:${seconds}`;
		if (options.ms) {
			time = `${time}.${milliseconds}`;
		}
		if (options.day && days) {
			time = `${days} ${time}`;
		}
	
		return time;
	}
};