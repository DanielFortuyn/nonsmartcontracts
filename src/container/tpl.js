import Question from './question.js'

class Tpl {
    constructor(name, text, data) {
        this.name = name;
        this.text = text;
        this.data = data;
        this.questions = [];
        if(data) {
            this.traverseDataObject(this.data, '')
        }
    }
    traverseDataObject(data, path) {
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'object' && value !== null) {
                let finalPath = (path == '') ? key : path + "." + key;
                this.traverseDataObject(value, finalPath);
                if (typeof value.question !== 'undefined') {
                    this.questions.push(new Question(key, value, path));
                }
            }
        }
    }
}
export default Tpl;