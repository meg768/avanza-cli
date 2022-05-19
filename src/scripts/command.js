

module.exports = class Command {

    constructor(options) {
        var {command = 'noname', description = 'No description'} = options;

        this.command = command;
        this.description = description;
		this.log = console.log;
        this.debug = () => {};

        this.builder = (yargs) => {
            this.options(yargs);
        };

        this.handler = async (argv) => {
            try {
				this.argv = argv;
				
				await this.start();
                await this.run(this.argv);
				await this.stop();
            }
            catch (error) {
                this.log(error.stack);
                process.exit(-1);
            }            
        };
    }


    options(yargs) {
        yargs.usage(`Usage: $0 ${this.command}`);
        yargs.option('debug', {alias: 'd', describe: 'Debug mode', type:'boolean', default:true});
        yargs.option('help', {alias: 'h', describe: 'Show help', type:'boolean'});
        yargs.alias('version', 'v');
    }

	async login() {
	
		const Avanza = require('avanza');
		
		let avanza = new Avanza();

		await avanza.authenticate({
			username: process.env.USERNAME,
			password: process.env.PASSWORD,
			totpSecret: process.env.SECRET
		});

		return this.avanza = avanza;
			  
	}

	async logout() {
		if (this.avanza)
			this.avanza.disconnect();

		this.avanza = undefined;
	}


	async start() {
		this.debug = typeof this.argv.debug === 'function' ? this.argv.debug : (this.argv.debug ? this.log : () => {});	
	}

    async run() {
    }

	async stop() {
		this.logout();
	}

};



