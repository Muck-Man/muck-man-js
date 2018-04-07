const Detritus = require('./lib');

class MuckClient extends Detritus.Client
{
	constructor(options)
	{
		options = options || {};
		super(options.client);

		this.token = options.token;
	}

	request(options)
	{
		options = options || {};
		options.url = `https://muck.gg/api${options.url}`;
		options.headers = Object.assign(options.headers || {}, {Authorization: `Bot ${this.token}`});
		return this.rest.request(options);
	}
}

module.exports = MuckClient;