import Tpl from './tpl.js';

class Agreement extends Tpl {
    constructor(name, userId, text, data) {
        super(name, text, data);
        this.userId = userId;
        this.currentQuestion;
        this.compiled;
    }
    addQuestion(question) {
        this.questions.push(question);
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
}
export default Agreement;