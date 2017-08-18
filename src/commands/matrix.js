var sprintf  = require('yow/sprintf');
var isArray  = require('yow/is').isArray;
//var Avanza   = require('../js/avanza.js');
var Avanza   = require('avanza-mobile-client');
//var Avanza   = require('../js/avanza.js');


var Module = new function() {

	var _avanza = null;

	function defineArgs(args) {

		args.help('help').alias('help', 'h');

		args.usage('Usage: $0 market [id] <options>');

		args.option('debug',      {alias:'d', describe:'debug mode', default:false});
		args.option('name',       {alias:'n', describe:'name'});

		args.wrap(null);

		args.check(function(argv, foo) {

			return true;

		});

	}

	function getPrice(id) {
		return new Promise(function(resolve, reject) {
			_avanza.get(sprintf('/_mobile/market/index/%s', id)).then(function(result) {
				resolve({name:result.name, price:result.lastPrice, change:result.changePercent});
			})
			.catch(function(error) {
				reject(error);
			});
		})
	}

	function getPrices(ids) {
		return new Promise(function(resolve, reject) {

			var promise = Promise.resolve();
			var result = [];

			ids.forEach(function(id) {
				promise = promise.then(function() {
					return getPrice(id).then(function(foo) {
						result.push(foo);
					});
				});
			});

			promise.then(function() {
				resolve(result);
			})
			.catch(function(error) {
				reject(error);
			})

		})

	}

	function getWatchList(name) {
		return new Promise(function(resolve, reject) {
			Promise.resolve().then(function() {
				return _avanza.get('/_mobile/usercontent/watchlist');
			})
			.then(function(watchlist) {
				return watchlist.find(function(item) {
					return item.name == name;
				});
			})
			.then(function(result) {
				if (result == undefined)
					throw new Error('No such thing.');

				return result.orderbooks;
			})
			.then(function(result) {
				return getPrices(result);
			})
			.then(function(indices) {
				var result = [];

				indices.forEach(function(index) {
					result.push({name:index.name, price:index.price, change:index.change});
				});

				return result;
			})
			.then(function(result) {
				resolve(result);
			})
			.catch(function(error) {
				reject(error);

			});

		});

	}

	function runYY(argv) {

		try {
			var avanza = new Avanza();
			var credentials = {username: process.env.AVANZA_USERNAME, password:process.env.AVANZA_PASSWORD};

			avanza.login(credentials).then(function() {
				return avanza.get('/_mobile/account/overview');
			})
			.then(function(reply) {
				console.log(reply);

				return avanza.socket.open();
			})
			.then(function() {
				// Subscribe to OMX index
				avanza.socket.subscribe('quotes', '19002');

				avanza.socket.on('quotes', function(data) {
					var time = new Date(data.updated);
					console.log(time.toLocaleTimeString(), data.orderbookId, data.lastPrice);
				});

				return new Promise(function(resolve, reject) {
					setTimeout(resolve, 10000);
				});
			})
			.then(function() {
				avanza.socket.close();
			})
			.catch(function(error) {
				console.log(error);
			});


		}
		catch(error) {
			console.log(error);
		}
	}
	function run(argv) {

		try {
			var avanza = _avanza = new Avanza();
			var credentials = {username: process.env.AVANZA_USERNAME, password:process.env.AVANZA_PASSWORD};

			avanza.login(credentials).then(function() {
				return getWatchList('Index');
			})
			.then(function(result) {
				console.log(result);
			})
			.then(function() {
			})
			.then(function() {
			})
			.catch(function(error) {
				console.log(error);
			});


		}
		catch(error) {
			console.log(error);
		}
	}

	module.exports.command  = 'matrix';
	module.exports.describe = 'Matrix';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;



};
