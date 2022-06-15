
const Command = require('../scripts/avanza-command.js');

module.exports = class extends Command {
	

	constructor() {
		super({command:'accounts', description:'Show Avanza accounts'});
	}
	
	async options(yargs) {
		super.options(yargs);
	}

	async run() {
		this.output(await this.avanza.getOverview());
	}


};
