
const Command = require('../scripts/command.js');

module.exports = class extends Command {
	

	constructor() {
		super({command:'login', description:'Specify credentials'});
	}

	options(yargs) {
		super.options(yargs);
		yargs.option('username', {alias: 'u', describe: 'Username'});
		yargs.option('password', {alias: 'p', describe: 'Password'});
		yargs.option('secret', {alias: 's', describe: 'Secret'});
	}
	
	async run() {
		const Avanza = require('avanza');

		if (this.argv.username == undefined)
			throw new Error(`A username is required.`);

		if (this.argv.password == undefined)
			throw new Error(`A password is required.`);

		if (this.argv.secret == undefined)
			throw new Error(`A secret is required.`);

		let avanza = new Avanza();

		await avanza.authenticate({username: this.argv.username, password: this.argv.password, totpSecret: this.argv.secret});

		this.config.username = this.argv.username;
		this.config.password = this.argv.password;
		this.config.secret   = this.argv.secret;

		this.saveConfig();

		avanza.disconnect();


	}


};
