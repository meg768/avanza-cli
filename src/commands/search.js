var sprintf  = require('yow/sprintf');
var isArray  = require('yow/is').isArray;


var Module = new function() {

	function defineArgs(args) {

		args.help('help').alias('help', 'h');

		args.usage('Usage: $0 search [query] <options>');
		args.option('type', {alias:'t', describe:'Type of search', default:false, demand:false, choices:['all', 'stock', 'fund', 'bond', 'index', 'certificate'], default:'all'});
		args.wrap(null);


	}


	function run(argv) {

		function search(text = 'Mauritz', limit = 10) {
			return new Promise(function(resolve, reject) {
				var Avanza = require('avanza-mobile-client');
				var avanza = new Avanza();

				avanza.login().then(function() {
					return avanza.get({
			            path: '/_mobile/market/search',
			            query: {limit:limit, query:text}
			        });
				})
				.then(function(reply) {
					resolve(reply);
				})
				.catch(function(error) {
					reject(error);
				})
			});
		}


		try {

			search(argv.query).then(function(reply) {

				if (argv.debug)
					console.log(JSON.stringify(reply, null, 2));
				else {

					var table = require('text-table');

					var list = [];
					var header = [];
					var additionalHits = 0;

					header.push(['Type', 'ID', 'Name', 'Ticker', 'Price', 'Change %', 'Currency']);

					reply.hits.forEach(function(hit) {

						if (isArray(hit.topHits)) {
							hit.topHits.forEach(function(topHit) {
								list.push([hit.instrumentType, topHit.id, topHit.name, topHit.tickerSymbol, topHit.lastPrice == null ? '-' : topHit.lastPrice, topHit.changePercent == null ? '-' : topHit.changePercent, topHit.currency == null ? '-' : topHit.currency]);
							});

						}
						else {
							additionalHits += hit.numberOfHits;
						}
					});

					if (list.length > 0) {
						console.log(table(header.concat(list), {align:['l', 'l', 'l', 'l', 'r', 'r', 'l']}));

						if (additionalHits > 0) {
							console.log(sprintf('%d additional hits found.', additionalHits));
						}

					}
				}
			})
			.catch(function(error) {
				console.log(error);

			});
		}
		catch(error) {
			console.log(error);
		}
	}

	module.exports.command  = 'search <query>';
	module.exports.describe = 'Search';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;



};
