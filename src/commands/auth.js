
const Command = require('../scripts/command.js');

module.exports = class extends Command {
	

	constructor() {
		super({command:'auth', description:'Generate a 2FA code for current credentials'});
	}
	
	async run() {
		let code = require('avanza/dist/totp')(this.config.secret);
		this.log(`Authentication code is ${code}.`);
	}

};
