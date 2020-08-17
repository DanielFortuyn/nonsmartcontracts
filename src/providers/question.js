import PubSub from 'pubsub-js'

class Question {
    constructor() {
        this.questions;
        PubSub.subscribe('add.question', this.addQuestion)
    }
    addQuestion(topic,data) {
        this.quesions[data.userId].push(data.question);
    }
}
export let config = new Config();