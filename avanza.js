#!/usr/bin/env node

require('dotenv').config();

class App {
	

	constructor() {
	}

	addCommand(fileName) {
		let yargs = require('yargs');
	
		let Command = require(fileName);
		let cmd = new Command(); 

		yargs.command({
			command: cmd.command,
			builder: cmd.builder,
			handler: cmd.handler,
			desc:    cmd.description 
		});  
	}

	async run() {
		try {
			let args = require('yargs');

			//args.usage('Usage: $0 <command> [options]')

			//args.option('d', {alias:'debug', describe:'Debug mode', default:true});
/*
			args.command(require('./src/commands/accounts.js'));
			args.command(require('./src/commands/positions.js'));
			args.command(require('./src/commands/orders.js'));
			args.command(require('./src/commands/buy.js'));
			args.command(require('./src/commands/search.js'));
			args.command(require('./src/commands/socket.js'));
			args.command(require('./src/commands/sell.js'));
			args.command(require('./src/commands/market.js'));
			args.command(require('./src/commands/overview.js'));
			args.command(require('./src/commands/test.js'));
*/

			this.addCommand('./src/commands/test.js');
			this.addCommand('./src/commands/auth.js');
			this.addCommand('./src/commands/overview.js');
			this.addCommand('./src/commands/account.js');
			this.addCommand('./src/commands/accounts.js');
			this.addCommand('./src/commands/login.js');
			this.addCommand('./src/commands/watchlists.js');
			this.addCommand('./src/commands/instrument.js');
			this.addCommand('./src/commands/orderbooks.js');
			this.addCommand('./src/commands/positions.js');
			this.addCommand('./src/commands/summary.js');

			args.help();

			args.check(function(argv) {
				return true;
			});
			args.wrap(null);
			args.demand(1);

			return args.argv;

		}

		catch(error) {
			console.log(error.stack);
			process.exit(-1);
		}

	}
};

new App().run();
