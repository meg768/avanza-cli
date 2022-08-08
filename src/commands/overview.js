
const Command = require('../scripts/avanza-command.js');

let moneyPrinter = (value, width) => {
    let EasyTable = require('easy-table');
    let round = require('yow/round');
    let text = round(value, 0).toString();
    return width ? EasyTable.padLeft(text, width) : text;
};

let percentPrinter = (value, width) => {
    let EasyTable = require('easy-table');
    let round = require('yow/round');
    let text = round(value, 1).toLocaleString();
    return width ? EasyTable.padLeft(text, width) : text;
};

module.exports = class extends Command {
	

	constructor() {
		super({command:'overview', description:'Show overview'});
	}
	
	async options(yargs) {
		super.options(yargs);
        yargs.option('json', {alias:'j', type:'boolean', describe:'Display JSON', default:false});
        yargs.option('account', {alias:'a', type:'string', describe:'Account name/id', default:undefined});


	}

	async run() {
		let overview = await this.avanza.getOverview();
        let accounts = overview.accounts;
        let output = [];

        if (this.argv.account != undefined) {

            accounts = accounts.filter((item) => {
                return item.name.toLowerCase() == this.argv.account.toLowerCase();
            });
        }

        if (this.argv.json)
    		this.log(overview);
        else {
            let EasyTable = require('easy-table');
            let table = new EasyTable();          
            
            accounts.forEach(item => {
                table.cell('Kontonr', item.accountId);
                table.cell('Namn', item.name);
                table.cell('Kontotyp', item.accountType);
                table.cell('Utveckling i år', item.performance, moneyPrinter);
                table.cell('Utveckling i år (%)', item.performancePercent, percentPrinter);
                table.cell('Totalt värde', item.ownCapital, moneyPrinter);
                table.cell('Tillg. för köp', item.buyingPower, moneyPrinter);
                table.cell('Värde vid årets start', item.ownCapital * (1-item.performancePercent/100), moneyPrinter);
                table.newRow();
                    
            });

            let reduce = (acc, val, idx, len) => {
                if (idx+1 == len) {
                    let A = 0;
                    let B = 0;

                    accounts.forEach(item => {
                        A += item.ownCapital * (1-item.performancePercent/100);                            
                        B += item.ownCapital;
                    });
        
                    console.log(A, B);
                    return 100*(B-A)/B;
                }
            };
            table.total('Utveckling i år', {printer: moneyPrinter});			
            table.total('Utveckling i år (%)', {printer: percentPrinter, reduce:reduce});			
            table.total('Totalt värde', {printer: moneyPrinter});			
            table.total('Värde vid årets start', {printer: moneyPrinter});	
            table.total('Tillg. för köp', {printer: moneyPrinter});	
            		

            this.log(table.toString());
        }
	}


};
