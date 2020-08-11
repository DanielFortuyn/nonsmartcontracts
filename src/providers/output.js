import Handlebars from 'handlebars'
import fs from 'fs';
import path from 'path';
import marked from 'marked';
import md5 from 'md5';
import PubSub from 'pubsub-js'
import DataProvider from './data.js';
import dotenv from 'dotenv'

dotenv.config();
let e = process.env;
const splittert = e.SPLITTER;

class Output {
    constructor(template) {
        this.partials = {}
        this.dataProvider = new DataProvider();
        this.registerHelpers();
    }
    async  loadTemplate(template) {
        await this.registerPartials();
        this.registerHelpers()
    }
    registerHelpers() {
        let article = 1;
        let subcount = 1;

        Handlebars.registerHelper('count', function (count) {
            subcount = 1;
            return article++;
        });

        Handlebars.registerHelper('subcount', function (count) {
            return subcount++;
        });
    }
    async *walk(dir) {
        for await (const d of await fs.promises.opendir(dir)) {
            const entry = path.join(dir, d.name);
            if (d.isDirectory()) yield* await walk(entry);
            else if (d.isFile()) yield entry;
        }
    }
    async parseFile(name, p) {
        let file = fs.readFileSync(p, 'utf8');
        let parts = file.split(splittert);        
        
        if(parts.length == 3) {
            this.partials[name] = await this.dataProvider.fixData(parts[1]);
            return parts[2];
        }        
        return file;
    }
    compile(data) {
        console.log(typeof data.agreementText);
        let compiled = Handlebars.compile(data.agreementText);
        // compiled(data.data);
        // for (var name in Handlebars.partials) {
        //     var partial = Handlebars.partials[name]
        //     if (typeof partial === 'function') {
        //         // add these questions
        //       console.log('Using partial' + name);
        //       console.log("DATA", this.partials[name]);
        //     } else {
        //         console.log('Not using ' + name);
        //     }
        // }
        // console.log(compiled(data.data))
        console.log(typeof data.data);
        return compiled(data.data)
    }
    getFileName(data) {
        return md5(JSON.stringify(data.data));
    }
    async compileHtml(userId, data) {
        let filename = await this.getFileName(data) +'.html';
        let template = await this.compile(data);
        let output =await this.mergeFiles(template, data.data)
        fs.writeFileSync('output/' + filename, output);
        return filename;
    }
    compileMd(userId, data) {
        let filename = this.getFileName(data) +'.md';
        let markdown = this.compile(data);
        fs.writeFileSync('output/'+ filename, markdown);
        return filename;
    }
     mergeFiles(markdown, data)  {
        let pre = Handlebars.compile(fs.readFileSync('templates/pre.handlebars', 'utf8'));
        let post = Handlebars.compile(fs.readFileSync('templates/post.handlebars','utf8' ));
        return pre(data) + marked(markdown) + post(data);
    }
    async registerPartials() {
        const partialPath = 'partials/';
        for await (const p of this.walk(partialPath)) {
            let name = p.replace(partialPath,'').replace('.partial','');
            let parse = await this.parseFile(name, p);
            console.log(typeof parse)
            console.log(parse);
            Handlebars.registerPartial(name, parse);
        }        
    }
}
export default Output;
