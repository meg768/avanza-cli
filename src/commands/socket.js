var sprintf  = require('yow/sprintf');
var isArray  = require('yow/is').isArray;
var Avanza   = require('../js/avanza.js');

var Module = new function() {

	function defineArgs(args) {

		args.help('help').alias('help', 'h');

		args.usage('Usage: $0 socket [query] <options>');

		args.option('debug',      {alias:'d', describe:'debug mode', default:false});

		args.wrap(null);

		args.check(function(argv, foo) {

			return true;

		});

	}

	function run(argv) {

		try {
			var avanza = new Avanza({username: process.env.AVANZA_USERNAME, password:process.env.AVANZA_PASSWORD});

			avanza.login().then(function() {
				return Promise.resolve();
			})

			.then(function() {

				avanza.socket.initialize();

				avanza.socket.on('connect', function() {
					console.log('Subscribing...')
					avanza.socket.subscribe('19002', ['quotes']);
//					avanza.socket.subscribe('5364', ['quotes']);

				});

				avanza.socket.on('quotes', function(quote) {
					console.log('quotes', quote);
				});

			})
			.catch(function(error) {
				console.log(error);

			});
		}
		catch(error) {
			console.log(error);
		}
	}

	module.exports.command  = 'socket';
	module.exports.describe = 'Socket';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;



};
