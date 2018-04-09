const MuckClient = require('./MuckClient.js');

const client = new MuckClient({
	client: {
		token: '', //discord token
		cache: {messages: {expire: 30}},
		gateway: {loadAllMembers: true}
	},
	commandClient: {
		prefixes: ['.m', '.muck'],
		prefixSpace: true,
		mentions: true
	},
	token: '', //muck api token
	path: './Commands'
});

client.run().catch(console.error);