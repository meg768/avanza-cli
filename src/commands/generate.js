
const Command = require('../scripts/Command.js');

module.exports = class extends Command {
	

	constructor() {
		super({command:'generate', description:'Test script'});
	}
	
	async run() {

		this.log(require('avanza/dist/totp')(process.env.SECRET));
	}


};
