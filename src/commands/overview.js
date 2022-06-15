
const Command = require('../scripts/avanza-command.js');

module.exports = class extends Command {
	

	constructor() {
		super({command:'overview', description:'Show overview'});
	}
	
	async options(yargs) {
		super.options(yargs);
	}

	async run() {
		let json = await this.avanza.getOverview();
		this.output(json);
	}


};
