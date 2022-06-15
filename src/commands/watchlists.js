
const Command = require('../scripts/avanza-command.js');

module.exports = class extends Command {
	

	constructor() {
		super({command:'watchlists', description:'Show watchlists'});
	}
	
	async options(yargs) {
		super.options(yargs);
	}

	async run() {
		let json = await this.avanza.getWatchlists();
		this.output(json);
	}


};
