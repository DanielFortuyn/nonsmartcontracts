import Handlebars from 'handlebars'
import fs from 'fs';
import path from 'path';
import marked from 'marked';
import md5 from 'md5';

let e = process.env;
const split = e.split;

class Output {
    constructor() {
        this.registerHelpers();
        this.registerPartials();
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
    parseFile(p) {
        let file = fs.readFileSync(p, 'utf8');
        let parts = file.split(split);        
        
        if(parts.length == 3) {
            this.data = {...this.data, ...helpers.fixData(parts[1])};
            return parts[2];
        }        
        return file;
    }
    compile(userId,data) {
        let tpl = Handlebars.compile(data.agreementText);
        let result = tpl(data.data);
        console.log("RESULT", result);
        return result;
    }
    getFileName(data) {
        return md5(JSON.stringify(data.data));
    }
    compileHtml(userId, data) {
        let filename = this.getFileName(data) +'.html';
        let template = this.compile(userId, data);
        let output = this.mergeFiles(template, data.data)
        fs.writeFileSync('output/' + filename, output);
        return filename;
    }
    compileMd(userId, data) {
        let filename = this.getFileName(data) +'.md';
        let markdown = this.compile(userId,data);
        fs.writeFileSync('output/'+ filename, markdown);
        return filename;
    }
    mergeFiles(markdown, data)  {
        let pre = Handlebars.compile(fs.readFileSync('templates/pre.handlebars', 'utf8'));
        let post = Handlebars.compile(fs.readFileSync('templates/post.handlebars','utf8' ));
        return pre(this.data) + marked(markdown) + post(this.data);
    }
    async registerPartials() {
        const partialPath = 'partials/';
        for await (const p of this.walk(partialPath)) {
            let name = p.replace(partialPath,'').replace('.partial','');
            Handlebars.registerPartial(name,  this.parseFile(p, 'utf8'));
        }        
    }
}
export default Output;
