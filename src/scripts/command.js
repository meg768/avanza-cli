const Path = require('path');
const os = require('os');
const config = require('yow/config.js');


module.exports = class Command {

    constructor(options) {
        let {command = 'noname', description = 'No description'} = options;

        this.command = command;
        this.description = description;
		this.log = console.log;
        this.debug = () => {};
		this.config = {};

		this.loadConfig();

		this.builder = (yargs) => {
            this.options(yargs);
        };

        this.handler = async (argv) => {
            try {
				this.argv = argv;
				
				this.debug = typeof this.argv.debug === 'function' ? this.argv.debug : (this.argv.debug ? this.log : () => {});	

				await this.start();
                await this.run(this.argv);
				await this.stop();
            }
            catch (error) {
				let msg = '';

				if (error instanceof Error) {
					console.log(error.stack);
				}
				else {
					console.log(error);
				}

				process.exit(-1);
            }            
        };
    }


	loadConfig() {
		try {
			this.config = config.load(Path.join(Path.join(os.homedir(), '.avanza-cli'), 'config.json'));
		}
		catch(error) {
		}
	}

	saveConfig() {
		config.save();
	}

    options(yargs) {
        yargs.usage(`Usage: $0 ${this.command}`);
        yargs.option('debug', {alias: 'd', describe: 'Debug mode', type:'boolean', default:false});
        yargs.option('help', {alias: 'h', describe: 'Show help', type:'boolean'});
        yargs.alias('version', 'v');
    }

	async start() {
	}

    async run() {
    }

	async stop() {
	}

	output(json) {
		console.log(JSON.stringify(json, null, '   '));
	}

};



