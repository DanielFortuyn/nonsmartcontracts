const Handlebars = require('handlebars');
const marked = require('marked');
const moment = require('moment');
const locale = require('moment/locale/nl');
const fs = require('fs');
const path = require('path');
const YAML = require('yamljs');

var fuzzy = require('fuzzy');
var inquirer = require('inquirer');
const { template } = require('handlebars');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const split = '#-!-#';

let helpers = {
    agreements: [],
    data: [],
    init: async function() {        
        await this.registerPartials();
        await this.registerAgreements();
        await this.registerHelpers();
    },
    search: function (input, values, defaultValue) {
        input = input || '';
        return new Promise(function (resolve) {
            try {
                if (input == '') {
                    resolve([defaultValue]);
                } else {
                    var options = {
                        extract: function(el) {
                            return el.name;
                        }
                    }
                    var fuzzyResult = fuzzy.filter(input, values, options);
                    resolve(
                        fuzzyResult.map(function (el) {
                            return el.original;
                        })
                    );
                }
            } catch (e) {
                console.error(e);
            }
        });
    },
    askAgreement: async function () {
        let self = this;
        return await inquirer.prompt([
            {
                name: 'agreement',
                type: "autocomplete",
                choices: self.agreements,
                source: function (answers, input) {
                    return self.search(input, self.agreements, self.agreements[0]);
                }
            },
        ])
    },
    walk: async function* walk(dir) {
        for await (const d of await fs.promises.opendir(dir)) {
            const entry = path.join(dir, d.name);
            if (d.isDirectory()) yield* await walk(entry);
            else if (d.isFile()) yield entry;
        }
    },
    registerHelpers: function() {
        let article = 1;
        let subcount = 1;
        Handlebars.registerHelper('count', function (count) {
            subcount = 1;
            return article++;
        });

        Handlebars.registerHelper('subcount', function (count) {
            return subcount++;
        });
    },
    registerPartials: async function() {
        const partialPath = 'partials/';
        for await (const p of this.walk(partialPath)) {
            let name = p.replace(partialPath,'').replace('.partial','');
            Handlebars.registerPartial(name,  fs.readFileSync(p, 'utf8'));
        }        
    },
    registerAgreements: async function() {
        const agreementPath = 'overeenkomsten/';
        for await (const p of this.walk(agreementPath)) {
            if(p.includes('.agreement')) {
                this.agreements.push({
                    value: { path: p, name: p.replace('.agreement','').replace(agreementPath, '').replace('/','.')},
                    name: p.replace('.agreement','').replace(agreementPath, '').replace('/','.'),
                    short: p
                });
            }
        }
    },
    fixMoment: function(dataObject) {
        let momentRegexp = /moment\(\'(.*)\'\)/;
        for(var i in dataObject) {
            let result = momentRegexp.exec(dataObject[i]);
            if(result) {
                dataObject[i] = moment(result[1]).locale('nl',locale).format('LL');
            }
            //Scheisse recursie
            if(typeof dataObject[i] == "object") {
                dataObject[i] = this.fixMoment(dataObject[i]);
            }
        }
        return dataObject;
    },
    fixData: function(inputData) {
        dataObject = YAML.parse(inputData);
        dataObject = helpers.fixMoment(dataObject);

        if('partij1' in dataObject && 'hierna' in dataObject.partij1) {
            dataObject[dataObject.partij1.hierna] = dataObject.partij1;
        }
        if('partij2' in dataObject && 'hierna' in dataObject.partij2) {
            dataObject[dataObject.partij2.hierna] = dataObject.partij2;
        }
        return dataObject;
    },
    parseFile: function(path) {
        let file = fs.readFileSync(path, 'utf8');
        let parts = file.split(split);        
        
        if(parts.length == 3) {
            this.data = helpers.fixData(parts[1]);
            return Handlebars.compile(parts[2]);
        }        
        return Handlebars.compile(file);
    },
    mergeFiles: function(template)  {
        let pre = Handlebars.compile(fs.readFileSync('templates/pre.handlebars', 'utf8'));
        let post = Handlebars.compile(fs.readFileSync('templates/post.handlebars','utf8' ));

        return pre(this.data) + marked(template(this.data)) + post(this.data);
    }
}


let main = async function() {
    try {
        await helpers.init();
        let answers  = await helpers.askAgreement();
        
        let template = helpers.parseFile(answers.agreement.path);
        helpers.data.answers = answers;

        fs.writeFileSync('output/'+answers.agreement.name+'.html', helpers.mergeFiles(template ));
    } catch(e) {
        console.error(e);
    }
}

main();

