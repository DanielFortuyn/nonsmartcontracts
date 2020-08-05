import template from 'handlebars';
import dotenv from 'dotenv';
import Handlebars from 'handlebars';
import marked from 'marked';
import fs from 'fs'
import YAML from 'yaml'

let e = process.env;
let split = e.SPLIT || "#-!-#";

class Agreement {
    constructor(path) {
        this.data = {}
        this.agreementText = this.parseFile(path);
    }
    loadPartials() {

    }
    parseFile(path) {
        let file = fs.readFileSync(path, 'utf8');
        let parts = file.split(split);        
        if(parts.length == 3) {
            this.data = this.parseData(parts[1]);
            return parts[2];
        }        
        return file;
    }
    parseData(part) {
        this.data = YAML.parse(part);
        return this.data;
    }

}
export default Agreement