
const Command = require('../scripts/Command.js');
const sprintf = require('yow/sprintf');
const EasyTable = require('easy-table');

module.exports = class extends Command {
	

	constructor() {
		super({command:'overview', description:'Show Avanza overview'});
	}
	
	async run() {

		await this.login();

		let overview = await this.avanza.getOverview();

		let table = new EasyTable();
		let array = overview.accounts;

		let moneyPrinter = (value, width) => {
			var text = Math.floor(value).toLocaleString();
			return width ? EasyTable.padLeft(text, width) : text;
		};

		array = array.filter((item) => {
			return item.ownCapital > 1;
		});

		let accountType = {
			'KapitalforsakringBarn': 'Kapitalförsäkring (barn)',
			'Kapitalforsakring': 'Kapitalförsäkring',
			'Investeringssparkonto': 'ISK',
			'SparkontoPlus': 'Sparkonto',
			'AktieFondkonto': 'Aktiedepå'
		}

		array.forEach((item) =>  {
			console.log(item);
			table.cell('Namn', item.name);
			table.cell('Typ', accountType[item.accountType] == undefined ? '-' : accountType[item.accountType]);
			table.cell('Konto', item.accountId);
			table.cell('Värde', item.ownCapital, moneyPrinter);
			table.newRow();
		});

//		table.sort(['Konto', 'Namn']);
		table.total('Värde', {printer: moneyPrinter});			

		this.log(table.toString());


	}


};
