const MuckClient = require('./MuckClient.js');
const Detritus = require('./lib');

const client = new MuckClient({
	client: {
		token: '', //discord token
		cache: {messages: {expire: 30}},
		gateway: {loadAllMembers: true}
	},
	token: '' //muck api token
});

const commandClient = new Detritus.CommandClient({
	prefixes: ['.m', '.muck'],
	prefixSpace: true,
	mentions: true
}, client);

commandClient.registerCommandsIn('./commands');

commandClient.on('COMMAND_NONE', (event) => {
	//console.log('COMMAND_NONE', event);
});

commandClient.on('COMMAND_FAIL', (event) => {
	//console.log('COMMAND_FAIL', event.error.message);
});

commandClient.on('COMMAND_RUN_SUCCESS', (event) => {
	//console.log('COMMAND_RUN_SUCCESS', event);
});

commandClient.on('COMMAND_RUN_FAIL', (event) => {
	console.log('COMMAND_RUN_FAIL', event.error, event.command.name);
});

commandClient.run();