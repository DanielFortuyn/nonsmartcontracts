import template from 'handlebars';
import dotenv from 'dotenv';
import Handlebars from 'handlebars';
import marked from 'marked';
import fs from 'fs'
import YAML from 'yaml'

dotenv.config();

let e = process.env;
let split = e.SPLITTER || "#-!-#";

class Agreement {
    constructor() {
        this.data = {}
        this.agreementText = ''
    }
    loadPartials() {

    }
    async parseFile(path) {
        let file = await fs.readFileSync(path, 'utf8');
        let parts = file.split(split);    
        console.log("SPLITTER", split, parts.length);
        if(parts.length == 3) {
            this.data = this.parseData(parts[1]);
            this.agreementText =  parts[2];
            return this.agreementText
        }        
        this.agreementText = file;
        return this.agreementText
    }
    parseData(part) {
        this.data = YAML.parse(part);
        return this.data;
    }

}
export default Agreement