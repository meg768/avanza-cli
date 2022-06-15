
function round(value, precision) {
	var multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
}


function delay(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});
}

module.exports = class AvanzaSummary {
	
	constructor(options) {
		this.options = options;
		this.avanza = undefined;
	}
	
	async delay(ms) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve();
			}, ms);

		});
	}

	async connect(options) {
	
		const Avanza = require('avanza');
		
		let avanza = new Avanza();
		let {username, password, secret} = options;

		await avanza.authenticate({username: username, password: password, totpSecret: secret});

		await delay(500);

		this.disconnect();
		return this.avanza = avanza;
			  
	}

	async disconnect() {
		if (this.avanza)
			this.avanza.disconnect();

		this.avanza = undefined;
	}


	async fetchInstrument(type, id) {

		type = type.toLowerCase();

		try {
			let instrument = await this.avanza.getInstrument(type, id);

			switch(type) {
				case 'fund': {
					let item = {};
					item.date = instrument.NAVLastUpdated;
					item.name = instrument.name;
					item.type = type;
					item.id = instrument.id;
					item.price = round(instrument.NAV, 2);
					item.change = instrument.changeSinceOneDay;

					item.performance = {
						'ytd': instrument.changeSinceTurnOfTheYear,
						'1d':  instrument.changeSinceOneDay,
						'1w':  instrument.changeSinceOneWeek,
						'1m':  instrument.changeSinceOneMonth,
						'3m':  instrument.changeSinceThreeMonths,
						'6m':  instrument.changeSinceSixMonths,
						'1y':  instrument.changeSinceOneYear,
						'3y':  instrument.changeSinceThreeYears
					};

					return item;
				}
	
				case 'index':
				case 'stock': {
					let item = {};
					item.date = instrument.lastPriceUpdated;
					item.name = instrument.name;
					item.type = type;
					item.id = instrument.id;
					item.price = round(instrument.lastPrice, 2);
					item.change = round(instrument.changePercent, 2);

					item.performance = {
						'ytd': round(100 * ((instrument.lastPrice / instrument.priceAtStartOfYear) - 1), 2),
						'1d':  round(instrument.changePercent, 2),
						'1w':  round(100 * ((instrument.lastPrice / instrument.priceOneWeekAgo) - 1), 2),
						'1m':  round(100 * ((instrument.lastPrice / instrument.priceOneMonthAgo) - 1), 2),
						'3m':  round(100 * ((instrument.lastPrice / instrument.priceThreeMonthsAgo) - 1), 2),
						'6m':  round(100 * ((instrument.lastPrice / instrument.priceSixMonthsAgo) - 1), 2),
						'1y':  round(100 * ((instrument.lastPrice / instrument.priceOneYearAgo) - 1), 2),
						'3y':  round(100 * ((instrument.lastPrice / instrument.priceThreeYearsAgo) - 1), 2)
					};

	
					return item;
				}
			}
		}
		catch(error) {
		}
	}

	async fetchAccounts() {

		let accounts = [];
		let overview = await this.avanza.getOverview();
		let positions = await this.avanza.getPositions();

		for (let account of overview.accounts) {
			let accountOverview = await this.avanza.getAccountOverview(account.accountId);

			let summary = {};
			summary.name = account.name;
			summary.id = account.accountId;
			summary.type = account.accountType;
			summary.capital = round(account.ownCapital, 0);
			summary.value = null;

			summary.performance = {
				'ytd':   round(account.performancePercent, 2),
				'1d':    null,
				'1w':    round(accountOverview.performanceSinceOneWeekPercent, 2),
				'1m':    round(accountOverview.performanceSinceOneMonthPercent, 2),
				'3m':    round(accountOverview.performanceSinceThreeMonthsPercent, 2),
				'6m':    round(accountOverview.performanceSinceSixMonthsPercent, 2),
				'1y':    round(accountOverview.performanceSinceOneYearPercent, 2),
				'3y':    round(accountOverview.performanceSinceThreeYearsPercent, 2)
			};

			summary.profit = {
				'ytd':   round(account.performance, 0),
				'1d':    null,
				'1w':    round(accountOverview.performanceSinceOneWeek, 0),
				'1m':    round(accountOverview.performanceSinceOneMonth, 0),
				'3m':    round(accountOverview.performanceSinceThreeMonths, 0),
				'6m':    round(accountOverview.performanceSinceSixMonths, 0),
				'1y':    round(accountOverview.performanceSinceOneYear, 0),
				'3y':    round(accountOverview.performanceSinceThreeYears, 0)

			};

			summary.positions = [];

			accounts.push(summary);
		}

		for (let instrumentPosition of positions.instrumentPositions) {

			for (let position of instrumentPosition.positions) {

				let account = accounts.find((element) => {
					return element.id == position.accountId;
				});

				if (account != undefined) {
					let instrument = await this.fetchInstrument(instrumentPosition.instrumentType, position.orderbookId);

					account.performance['1d'] = position.changePercent;

					account.value = position.value;
					account.profit['1d'] = position.value * position.changePercent / 100;
					account.performance['1d'] = 9999;
					account.positions.push({value:position.value, volume:position.volume, instrument:instrument});
	
				}

			}
		}		

		return accounts;
	}




	async fetchWatchList() {
		let result = [];
		let watchLists = await this.avanza.getWatchlists();

		for (let watchList of watchLists) {
			let orderbooks = await this.avanza.getOrderbooks(watchList.orderbooks);
			let instruments = [];

			for (let orderbook of orderbooks) {
				instruments.push(await this.fetchInstrument(orderbook.instrumentType, orderbook.id));
			}

			result.push({name:watchList.name, instruments:instruments});
		}

		return result;
	}
};
