import Tpl from './tpl.js';
import DataProvider from '../providers/data.js';

class Agreement extends Tpl {
    constructor(name, userId, text, data) {
        super(name, text, data);
        this.userId = userId;
        this.currentQuestion;
        this.compiled;
        this.dataProvider = new DataProvider()
    }
    addQuestion(question) {
        this.questions.push(question);
    }
    addData(key, value) {
        this.data[key] = value;
    }
    fetchQuestion() {
        this.currentQuestion = this.questions.shift()
        return this.currentQuestion;
    }
    provideAnswer(path, answer) {
        let cData = this.data;
        if(path.includes('.')) {
            this.set(cData, path, answer);
        } else {
            this.data[path] = answer;
        }
        this.currentQuestion = false;
    }
    set(obj, str, val) {
        str = str.split(".");
        while (str.length > 1)
            obj = obj[str.shift()];
        return obj[str.shift()] = val;
    }
    get (obj, desc) {
        var arr = desc.split('.');
        while (arr.length && (obj = obj[arr.shift()]));
        return obj;
    }
    cleanData() { 
        this.dataProvider.cleanAgreementData(this.data);
    }
}
export default Agreement;