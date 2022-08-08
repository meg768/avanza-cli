
const Command = require('../scripts/avanza-command.js');
const AvanzaSummary = require('../scripts/avanza-summary.js');

module.exports = class extends Command {
	

	constructor() {
		super({command:'summary', description:'Show Avanza summary'});

		this.summary = new AvanzaSummary();
	}
	
	async options(yargs) {
		super.options(yargs);
	}

/*
	async start() {
		await this.summary.connect({username:this.config.username, password:this.config.password, secret:this.config.secret});
	}

	async stop() {
		await this.summary.disconnect();
	}
*/
	async run() {
		this.output(await this.summary.fetchAccounts());
//		this.output(await this.summary.fetchWatchList());
	}


};
