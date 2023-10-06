
const Command = require('../scripts/avanza-command.js');

module.exports = class extends Command {
	

	constructor() {
		super({command:'instrument', description:'Shows instrument information'});
	}
	

	options(yargs) {
		super.options(yargs);
		yargs.option('id', {alias:'i', describe:'Instrument ID'});
		yargs.option('type', {alias:'t', describe:'Instrument type', default:'stock'});
	}

	async run() {
		this.output(await this.avanza.getInstrument(this.argv.type, this.argv.id));
	}


};
