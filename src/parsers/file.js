import template from 'handlebars';
import dotenv from 'dotenv';
import Handlebars from 'handlebars';
import marked from 'marked';
import fs from 'fs'
import YAML from 'yaml'
import {config} from '../providers/config.js'
import PubSub from 'pubsub-js'

let e = config.env;
let split = e.SPLITTER || "#-!-#";

class File {
    constructor() {
    }
    async parseFile(userId, path) {
        let file = {}
        let fileContents = await fs.readFileSync(path, 'utf8');
        let parts = fileContents.split(split);    
        if(parts.length == 3) {
            file.data = YAML.parse(parts[1]);
            file.text = parts[2];
            return file;
        }        
        file.text = fileContents;
        return file
    }
}
export default File;