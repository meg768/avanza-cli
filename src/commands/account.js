
const Command = require('../scripts/avanza-command.js');

module.exports = class extends Command {
	

	constructor() {
		super({command:'account <account>', description:'Show Avanza account'});
	}
	
	async options(yargs) {
		super.options(yargs);
	}

	async run() {
		this.output(await this.avanza.getAccountOverview(this.argv.account));
	}


};
