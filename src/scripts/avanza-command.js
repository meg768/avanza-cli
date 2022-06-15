const Command = require('./command.js')

module.exports = class AvanzaCommand extends Command {

    constructor(options) {
		super(options);
    }


	async start() {
	
		const Avanza = require('avanza');
		
		let avanza = new Avanza();

		await avanza.authenticate({
			username: this.config.username,
			password: this.config.password,
			totpSecret: this.config.secret
		});

		return this.avanza = avanza;
			  
	}

	async stop() {
		if (this.avanza)
			this.avanza.disconnect();

		this.avanza = undefined;
	}



};



