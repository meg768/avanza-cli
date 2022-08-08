
const Command = require('../scripts/avanza-command.js');

module.exports = class extends Command {
	
	constructor() {
		super({command:'test', description:'Test script'});
	}
	
	async run() {
        let EasyTable = require('easy-table');
		let positions = await this.avanza.getPositions();

		let table = new EasyTable();
		let array = [];

		positions.instrumentPositions.forEach((instrumentPosition) => {
			instrumentPosition.positions.forEach((position) => {
				array.push(position);
				this.debug(JSON.stringify(position));

			});
		});

		let moneyPrinter = (value, width) => {
			var text = Math.floor(value).toLocaleString();
			return width ? EasyTable.padLeft(text, width) : text;
		};

		array.forEach((item) =>  {
			table.cell('Namn', item.name);
			table.cell('Konto', item.accountName);
			table.cell('Värde', Math.floor(item.value), moneyPrinter);
			table.newRow();
		});

		table.sort(['Konto', 'Namn']);
		table.total('Värde', {printer: moneyPrinter});			

		this.log(table.toString());


	}


};
