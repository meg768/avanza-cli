var sprintf  = require('yow/sprintf');
var Gopher   = require('yow/request');

var isArray = require('yow/is').isArray;


var Module = new function() {

	var _argv = {};
	var _avanza = null;

	function defineArgs(args) {

		args.usage('Usage: $0 sell <options>');


		args.help('help').alias('help', 'h');

		args.wrap(null);

		args.check(function(argv, foo) {

			return true;

		});
	}

	function subscribe(id = '5364' /* Hennes & Mauritz */) {
		var Avanza = require('avanza-mobile-client');
		var avanza = new Avanza();

	    avanza.login().then(function() {
	        return avanza.socket.open();
	    })
	    .then(function() {
	        avanza.socket.subscribe('orders', id);

	        avanza.socket.on('orders', function(data) {
				console.log('data:', JSON.stringify(data, null, '  '));

				/*
				data: {
				  "orderbookId": "5364",
				  "buyPrice": 210.6,
				  "sellPrice": 210.7,
				  "spread": 0.05,
				  "closingPrice": 211.8,
				  "highestPrice": 211,
				  "lowestPrice": 209.4,
				  "lastPrice": 210.6,
				  "change": -1.2,
				  "changePercent": -0.57,
				  "lastUpdated": 1503041571000,
				  "volumeWeightedAveragePrice": 210.14,
				  "totalVolumeTraded": 548045,
				  "totalValueTraded": 115163497.9,
				  "changePercentNumber": -0.57,
				  "scale": null,
				  "updated": 1503041571000,
				  "updatedDisplay": "09:32"
				}
				*/

	        });

	        return new Promise(function(resolve, reject) {
	            setTimeout(resolve, 60000);
	        });
	    })
	    .then(function() {
	        avanza.socket.close();
	    })
	    .catch(function(error) {
	        console.log(error);
	    });
	}


	function search(text = 'Mauritz') {
		var Avanza = require('avanza-mobile-client');
		var avanza = new Avanza();

		avanza.login().then(function() {
			return avanza.get({
				path: '/_mobile/market/search',
				query: {limit:10, query:text}
			});
		})
		.then(function(reply) {
			console.log('reply:', JSON.stringify(reply, null, '  '));

			/*
			reply: {
			  "totalNumberOfHits": 1,
			  "hits": [
			    {
			      "instrumentType": "STOCK",
			      "numberOfHits": 1,
			      "topHits": [
			        {
			          "currency": "SEK",
			          "lastPrice": 211.8,
			          "changePercent": -1.3,
			          "flagCode": "SE",
			          "tradable": true,
			          "tickerSymbol": "HM B",
			          "name": "Hennes & Mauritz B",
			          "id": "5364"
			        }
			      ]
			    }
			  ]
			}
			*/

		})
		.catch(function(error) {
			console.log(error);
		});

	}


	function loginWithBankID() {
		var Avanza = require('avanza-mobile-client');
		var avanza = new Avanza();

		avanza.login({ssid:'660622-3995'}).then(function(reply) {
			console.log('reply:', JSON.stringify(reply, null, '  '));

			/*
			reply: {
			  "authenticationSession": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
			  "customerId": "123456",
			  "username": "user123",
			  "securityToken": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
			  "pushSubscriptionId": "XXXXXXXXXXXXXXXXXXXXXXXXX"
			}
			*/
		})
		.catch(function(error) {
			console.log(error);
		});

	}

	function login() {
		var Avanza = require('avanza-mobile-client');
		var avanza = new Avanza();

		var credentials = {username: process.env.AVANZA_USERNAME, password:process.env.AVANZA_PASSWORD};

		avanza.login(credentials).then(function(reply) {
			console.log('reply:', JSON.stringify(reply, null, '  '));

			/*
			reply: {
			  "authenticationSession": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
			  "customerId": "123456",
			  "username": "user123",
			  "securityToken": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
			  "pushSubscriptionId": "XXXXXXXXXXXXXXXXXXXXXXXXX"
			}
			*/
		})
		.catch(function(error) {
			console.log(error);
		});

	}

	function getAccounts() {

		var Avanza = require('avanza-mobile-client');
		var avanza = new Avanza();

		avanza.login().then(function() {
			return avanza.get({
				path: '/_mobile/account/list',
				query: {onlyTradable:false}
			});
		})
		.then(function(reply) {
			console.log('reply:', JSON.stringify(reply, null, '  '));

			/*
			reply: [
			  {
			    "totalBalance": 12345.67,
			    "ownCapital": 12345.67,
			    "buyingPower": 12345.67,
			    "name": "Depå",
			    "id": "1234567",
			    "type": "AktieFondkonto"
			  }
		    ]
			*/

		})
		.catch(function(error) {
			console.log(error);
		});
	}

	function getMarketIndex(id = '19002') {

		var Avanza = require('avanza-mobile-client');
		var avanza = new Avanza();

		avanza.login().then(function() {
			return avanza.get({
				path: '/_mobile/market/index/:id',
				params: {id:id}
			});
		})
		.then(function(reply) {
			console.log('reply:', JSON.stringify(reply, null, '  '));

			/*
			reply: {
			  "priceThreeMonthsAgo": 1628.37,
			  "priceOneWeekAgo": 1554.75,
			  "priceOneMonthAgo": 1639.33,
			  "priceSixMonthsAgo": 1570.59,
			  "priceAtStartOfYear": 1517.2,
			  "priceOneYearAgo": 1392.05,
			  "priceThreeYearsAgo": 1352.98,
			  "priceFiveYearsAgo": 1091.46,
			  "numberOfPriceAlerts": 0,
			  "pushPermitted": true,
			  "currency": "SEK",
			  "description": "Index över de trettio mest omsatta aktierna på Stockholmsbörsen.",
			  "flagCode": "SE",
			  "quoteUpdated": "2017-08-17T17:30:11.349+0200",
			  "title": "OMX Stockholm 30 - Stockholmsbörsen",
			  "highestPrice": 1552.5,
			  "lowestPrice": 1538.72,
			  "lastPrice": 1540.09,
			  "lastPriceUpdated": "2017-08-17T17:30:11.349+0200",
			  "change": -12.07,
			  "changePercent": -0.78,
			  "name": "OMX Stockholm 30",
			  "id": "19002"
			}
			*/

		})
		.catch(function(error) {
			console.log(error);
		});
	}



	function getWatchLists() {
		var Avanza = require('avanza-mobile-client');
		var avanza = new Avanza();

		avanza.login().then(function() {
			return avanza.get('/_mobile/usercontent/watchlist');
		})
		.then(function(reply) {
			console.log('reply:', JSON.stringify(reply, null, '  '));

			/*
			reply: [
			  {
			    "orderbooks": [
			      "455636"
			    ],
			    "editable": true,
			    "name": "Aktier",
			    "id": "6609729"
			  },
			  {
			    "orderbooks": [
			      "1933",
			      "157699"
			    ],
			    "editable": true,
			    "name": "Fonder",
			    "id": "6609710"
			  },
			  {
			    "orderbooks": [
			      "19002",
			      "18984",
			      "18997",
			      "155541"
			    ],
			    "editable": true,
			    "name": "Index",
			    "id": "6049956"
			  },
			  {
			    "orderbooks": [
			      "18998",
			      "19000"
			    ],
			    "editable": true,
			    "name": "Valutor",
			    "id": "6609677"
			  }
			]
			*/

		})
		.catch(function(error) {
			console.log(error);
		});

	}


	function getOverview() {
		var Avanza = require('avanza-mobile-client');
		var avanza = new Avanza();

		avanza.login().then(function() {
			return avanza.get('/_mobile/account/overview');
		})
		.then(function(reply) {
			console.log('reply:', JSON.stringify(reply, null, '  '));

			/*
			reply: {
			  "accounts": [
			    {
			      "accountType": "AktieFondkonto",
			      "interestRate": 0,
			      "depositable": true,
			      "active": true,
			      "performancePercent": 12345.67,
			      "totalProfit": 12345.67,
			      "attorney": false,
			      "accountId": "12345",
			      "tradable": true,
			      "totalBalance": 12345.67,
			      "accountPartlyOwned": false,
			      "totalBalanceDue": 0,
			      "ownCapital": 12345.67,
			      "buyingPower": 12345.67,
			      "totalProfitPercent": 12345.67,
			      "performance": 12345.67,
			      "name": "Depå"
			    }
			  ],
			  "numberOfOrders": 0,
			  "numberOfDeals": 0,
			  "totalBuyingPower": 12345.67,
			  "totalOwnCapital": 12345.67,
			  "totalPerformancePercent": 12.34,
			  "totalPerformance": 12345.67,
			  "numberOfTransfers": 0,
			  "numberOfIntradayTransfers": 0,
			  "totalBalance": 12345.67
			}

			*/

		})
		.catch(function(error) {
			console.log(error);
		});
	}

	function example2() {

		var Request = require('yow/request');
		var request = new Request('http://app-o.se', {
			headers: {'Content-Type': 'application/json'}
		});

		var options = {
			body:{
				user: process.env.MYSQL_USER,
				password: process.env.MYSQL_PASSWORD,
				query: "select symbol from stocks"

			}
		};

		request.get('/mysql/munch', options).then(function(response) {

			console.log(response);

		})

		.catch (function(error) {
			console.log(error);

		});


	}
	function example() {

		var Request = require('yow/request');
		var yahoo = new Request('https://query.yahooapis.com');

		function getQuote(ticker) {
			var query = {};

			query.q        = 'select * from yahoo.finance.quotes where symbol =  "' + ticker + '"';
			query.format   = 'json';
			query.env      = 'store://datatables.org/alltableswithkeys';
			query.callback = '';

			yahoo.get('/v1/public/yql', {query:query}).then(function(response) {
				var quotes = response.body.query.results.quote;

				if (typeof qoutes != 'Array')
					quotes = [quotes];

				console.log(ticker, '=', quotes[0].LastTradePriceOnly);

			})

			.catch (function(error) {
				console.log(error);

			});

		}

		getQuote('AAPL');

	};


	function getOrder(accountId = 'your-account-id', orderbookId = '5364') {
		var Avanza = require('avanza-mobile-client');
		var avanza = new Avanza();

		avanza.login().then(function() {
			return avanza.get({
				path: '/_mobile/order',
				query: {accountId:accountId, orderbookId:orderbookId}
			});
		})
		.then(function(reply) {
			console.log('reply:', JSON.stringify(reply, null, '  '));

			/*
			reply: {
			  "customer": {
			    "showCourtageClassInfoOnOrderPage": false,
			    "courtageClass": "XXXX"
			  },
			  "account": {
			    "type": "AktieFondkonto",
			    "totalBalance": 12345.67,
			    "buyingPower": 12345.67,
			    "name": "Depå",
			    "id": "1234567"
			  },
			  "orderbook": {
			    "lastPrice": 211.8,
			    "lastPriceUpdated": "2017-08-17T17:29:32.000+0200",
			    "change": -2.8,
			    "changePercent": -1.3,
			    "totalVolumeTraded": 3551786,
			    "totalValueTraded": 754374744.9,
			    "exchangeRate": 1,
			    "currency": "SEK",
			    "positionVolume": 0,
			    "flagCode": "SE",
			    "tradable": true,
			    "tickerSymbol": "HM B",
			    "tradingUnit": 1,
			    "volumeFactor": 1,
			    "name": "Hennes & Mauritz B",
			    "id": "5364",
			    "type": "STOCK"
			  },
			  "firstTradableDate": "2017-08-18",
			  "lastTradableDate": "2017-11-15",
			  "untradableDates": [],
			  "orderDepthLevels": [],
			  "orderDepthReceivedTime": "2017-08-17T17:29:32.395+0200",
			  "latestTrades": [
			    {
			      "cancelled": false,
			      "buyer": "AVA",
			      "matchedOnMarket": true,
			      "price": 211.8,
			      "volume": 500,
			      "dealTime": "2017-08-17T17:29:32.000+0200"
			    },
			    {
			      "cancelled": false,
			      "buyer": "AVA",
			      "matchedOnMarket": true,
			      "price": 211.8,
			      "volume": 200,
			      "dealTime": "2017-08-17T17:29:32.000+0200"
			    },
			    {
			      "cancelled": false,
			      "buyer": "NON",
			      "seller": "SWB",
			      "matchedOnMarket": true,
			      "price": 211.8,
			      "volume": 173,
			      "dealTime": "2017-08-17T17:24:45.000+0200"
			    }
			  ],
			  "marketTrades": true,
			  "hasShortSellKnowledge": true,
			  "hasInstrumentKnowledge": true,
			  "tickSizeRules": [
			    {
			      "minPrice": 0,
			      "maxPrice": 0.4999,
			      "tickSize": 0.0001
			    },
			    {
			      "minPrice": 0.5,
			      "maxPrice": 0.9995,
			      "tickSize": 0.0005
			    }
			  ]
			}
			*/

		})
		.catch(function(error) {
			console.log(error);
		});

	}
	/*
	function buy(accountId, orderbookId, volume, price) {
		return new Promise(function(resolve, reject) {

			Promise.resolve().then(function() {
				return _this.request({
					method: 'GET',
					url: sprintf('https://www.avanza.se/_mobile/order?accountId=%s&orderbookId=%s', accountId, orderbookId)
				});
			})

			.then(function(json) {

				try {
					var now = new Date();
					var payload = {};

					payload.accountId   = accountId.toString();
					payload.orderType   = 'BUY';
					payload.orderbookId = orderbookId.toString();
					payload.price       = json.orderbook.sellPrice != undefined ? json.orderbook.sellPrice : json.orderbook.lastPrice;
					payload.volume      = volume;
					payload.validUntil  = sprintf('%04d-%02d-%02d', now.getFullYear(), now.getMonth() + 1, now.getDate());

					if (payload.volume * payload.price > json.account.buyingPower)
						throw new Error(sprintf('Missing buying power'));

					//console.log(JSON.stringify(payload, null, '  '));
					//return Promise.resolve(payload);

					return _this.request( {
						method: 'POST',
						url: 'https://www.avanza.se/_api/order',
						body: JSON.stringify(payload)
					});
				}
				catch (error) {
					reject(error);
				}

			})
			.then(function(json) {
				resolve(json);
			})
			.catch (function(error) {
				reject(error);
			})
		});

	}

*/
	function run(argv) {

		try {
			subscribe();
			//search();
			//getOverview();
			//getWatchLists();
			//getMarketIndex();
			//getOrder('1367341', '5364');

		}
		catch(error) {
			console.log(error);
		}
	}

	module.exports.command  = 'test';
	module.exports.describe = 'Test';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;



};
