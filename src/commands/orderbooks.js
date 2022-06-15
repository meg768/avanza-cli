
const Command = require('../scripts/avanza-command.js');
const isArray = require('yow/isArray');

module.exports = class extends Command {
	

	constructor() {
		super({command:'orderbooks', description:'Show orderbooks'});
	}
	
	async options(yargs) {
		super.options(yargs);
		yargs.option('id', {alias:'i', describe:'Orderbook ID'});

	}

	async run() {
		let ids = isArray(this.argv.id) ? this.argv.id : [this.argv.id];
		let json = await this.avanza.getOrderbooks(ids);
		this.output(json);
	}


};
