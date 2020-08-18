import Handlebars from 'handlebars'
import fs from 'fs';
import path from 'path';
import marked from 'marked';
import md5 from 'md5';
import PubSub from 'pubsub-js'
import FileParser from '../parsers/file.js'
import { config } from './config.js'
import Partial from '../container/partial.js'

let e = config.env;
const splittert = e.SPLITTER;

class Output {
    constructor() {
        this.partials = {}
        this.parser = new FileParser();
    }
    async init() {
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

        if (parts.length == 3) {
            this.partials[name] = await this.dataProvider.fixData(parts[1]);
            return parts[2];
        }
        return file;
    }
    preProcess(agreement) {
        let compiled = Handlebars.compile(agreement.text);
        compiled({});
        for (var name in Handlebars.partials) {
            var partial = Handlebars.partials[name]
            if (typeof partial === 'function') {
                let partialObject = this.partials[name];
                // add these questions
                partialObject.questions.forEach(element => {
                    agreement.addQuestion(element);
                });
                // add the static data
                if (typeof partialObject.data != 'undefined') {
                    for (var key of Object.keys(partialObject.data)) {
                        agreement.addData(key, partialObject.data[key]);
                    }
                }

            }
        }
        return compiled
    }
    getFileName(data) {
        return md5(JSON.stringify(data));
    }
    compileHtml(userId, data) {
        this.registerHelpers();
        let compiled = Handlebars.compile(data.text);
        let filename = this.getFileName(data.data) + '.html';
        let template = compiled(data.data);
        let output = this.mergeFiles(template, data.data)
        fs.writeFileSync('output/' + filename, output);
        return filename;
    }
    compileMd(userId, data) {
        this.registerHelpers();
        let compiled = Handlebars.compile(data.text);
        let filename = this.getFileName(data) + '.md';
        let markdown = compiled(data.data);
        fs.writeFileSync('output/' + filename, markdown);
        return filename;
    }
    mergeFiles(markdown, data) {
        let pre = Handlebars.compile(fs.readFileSync('templates/pre.handlebars', 'utf8'));
        let post = Handlebars.compile(fs.readFileSync('templates/post.handlebars', 'utf8'));
        return pre(data) + marked(markdown) + post(data);
    }
    async registerPartials() {
        const partialPath = 'partials/';
        for await (const p of this.walk(partialPath)) {
            let name = p.replace(partialPath, '').replace('.partial', '');
            let parse = await this.parser.parseFile(name, p);
            this.partials[name] = new Partial(name, parse.text, parse.data);
            Handlebars.registerPartial(name, this.partials[name].text);
        }
    }
}
export default Output;
