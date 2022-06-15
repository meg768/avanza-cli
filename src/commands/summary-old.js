
const Command = require('../scripts/command.js');
const round = require('yow/round');

module.exports = class extends Command {
	

	constructor() {
		super({command:'summary', description:'Show Avanza summary'});
	}
	
	async options(yargs) {
		super.options(yargs);
	}

	async fetchInstrumentSummary(type, id) {

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
	
					item['ytd'] = round(instrument.changeSinceTurnOfTheYear, 2);
					item['1d'] = instrument.changeSinceOneDay;
					item['1w'] = instrument.changeSinceOneWeek;
					item['1m'] = instrument.changeSinceOneMonth;
					item['3m'] = instrument.changeSinceThreeMonths;
					item['6m'] = instrument.changeSinceSixMonths;
					item['1y'] = instrument.changeSinceOneYear;
					item['3y'] = instrument.changeSinceThreeYears;
	
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
	
					item['ytd'] = round(100 * ((instrument.lastPrice / instrument.priceAtStartOfYear) - 1), 2);
					item['1d'] = round(instrument.changePercent, 2);
					item['1w'] = round(100 * ((instrument.lastPrice / instrument.priceOneWeekAgo) - 1), 2);
					item['1m'] = round(100 * ((instrument.lastPrice / instrument.priceOneMonthAgo) - 1), 2);
					item['3m'] = round(100 * ((instrument.lastPrice / instrument.priceThreeMonthsAgo) - 1), 2);
					item['6m'] = round(100 * ((instrument.lastPrice / instrument.priceSixMonthsAgo) - 1), 2);
					item['1y'] = round(100 * ((instrument.lastPrice / instrument.priceOneYearAgo) - 1), 2);
					item['3y'] = round(100 * ((instrument.lastPrice / instrument.priceThreeYearsAgo) - 1), 2);
	
					return item;
				}
			}
		}
		catch(error) {
		}


	}

	async fetchAccounts() {
		const round = require('yow/round');

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

			summary['total'] = {
				performance:round(account.totalProfitPercent, 2),
				profit:round(account.totalProfit)
			};
			summary['ytd'] = {
				performance:round(account.performancePercent, 2),
				profit:round(account.performance)
			};
			summary['1w'] = {
				performance: round(accountOverview.performanceSinceOneWeekPercent, 2),
				profit:round(accountOverview.performanceSinceOneWeek)
			}
			summary['1m'] = {
				performance: round(accountOverview.performanceSinceOneMonthPercent, 2),
				profit:round(accountOverview.performanceSinceOneMonth)
			}
			summary['3m'] = {
				performance: round(accountOverview.performanceSinceThreeMonthsPercent, 2),
				profit:round(accountOverview.performanceSinceThreeMonths)
			}
			summary['6m'] = {
				performance: round(accountOverview.performanceSinceSixMonthsPercent, 2),
				profit:round(accountOverview.performanceSinceSixMonths)
			}
			summary['1y'] = {
				performance: round(accountOverview.performanceSinceOneYearPercent, 2),
				profit:round(accountOverview.performanceSinceOneYear)
			}
			summary['3y'] = {
				performance: round(accountOverview.performanceSinceThreeYearsPercent, 1),
				profit:round(accountOverview.performanceSinceThreeYears)
			}

			summary.positions = [];

			accounts.push(summary);
		}

		for (let instrument of positions.instrumentPositions) {

			for (let position of instrument.positions) {

				let account = accounts.find((element) => {
					return element.id == position.accountId;
				});

				if (account != undefined) {
					let summary = await this.fetchInstrumentSummary(instrument.instrumentType, position.orderbookId);

					if (summary)
						account.positions.push(summary);
	
				}

			}
		}		

		return accounts;
	}

	async fetchWatch() {
		let result = [];
		let watchLists = await this.avanza.getWatchlists();

		for (let watchList of watchLists) {
			let orderbooks = await this.avanza.getOrderbooks(watchList.orderbooks);
			let items = [];

			for (let orderbook of orderbooks) {

				let item = await this.fetchInstrumentSummary(orderbook.instrumentType, orderbook.id);

				if (item) 
					items.push(item);


			}

			if (items.length > 0)
				result.push({name:watchList.name, instruments:items});
		}

		return result;

	}

	async run() {
		await this.login();
/*
		this.watchlists = await this.avanza.getWatchlists();
		this.overview = await this.avanza.getOverview();
		this.positions = await this.avanza.getPositions();
		this.accounts = [];

		for (let account of this.overview.accounts) {
			this.accounts.push(await this.avanza.getAccountOverview(account.accountId));
		}

*/

		let output = {
			accounts:await this.fetchAccounts(),
			watch:await this.fetchWatch()
		}
		this.output(await this.fetchWatch());
//		this.output(await this.fetchAccounts());
//		this.output(output);

	}


};
