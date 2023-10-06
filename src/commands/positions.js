
const Command = require('../scripts/avanza-command.js');

module.exports = class extends Command {
	

	constructor() {
		super({command:'positions', description:'Show positions'});
	}
	
	options(yargs) {
		super.options(yargs);
	}

	async run() {
		let json = await this.avanza.getPositions();
		this.output(json);
	}


};
