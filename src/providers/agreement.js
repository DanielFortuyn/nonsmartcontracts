import fs from 'fs'
import path from 'path'

class Agreement {
    constructor(agreementPath) {
        this.agreementPath = agreementPath || [];
        this.agreements = [];
        this.register();
    }
    async *walk(dir) {
        for await (const d of await fs.promises.opendir(dir)) {
            const entry = path.join(dir, d.name);
            if (d.isDirectory()) yield* await this.walk(entry);
            else if (d.isFile()) yield entry;
        }
    }
    async register() {
        for await (const p of this.walk(this.agreementPath)) {
            if(p.includes('.agreement')) {
                let shortName = p.replace('.agreement','').replace(this.agreementPath, '')
                this.agreements.push({
                    value: { path: p, name: p.replace('.agreement','').replace(this.agreementPath, '').replace('/','.')},
                    name: shortName.replace('/','.'),
                    key: shortName.split('/')[shortName.split('/').length-1],
                    short: p
                });
            }
        }
    }
    buttonsFromAgreements() {
        let options = [];
        this.agreements.forEach(function(value, index) {
            options.push({
                type: 'postback',
                text: value.key,
                payload: 'setAgreement:' + value.value.path
            });
        });
        return options;
    }
}

export default Agreement