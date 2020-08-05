import SmoochAdapter from './adapters/smooch.js'
import AgreementProvider from './providers/agreement.js';
import AgreementParser from './parsers/agreement.js';
import dotenv from 'dotenv';
import WebhookProvider from './providers/webhook.js';
import PubSub from 'pubsub-js'
import DataProvider from './providers/data.js';
import OutputProvider from './providers/output.js';

dotenv.config();
let e = process.env;
const agreementPath = 'agreements/';
const split = e.SPLITTER || '#-!-#'

class Application {
    constructor() {
        this.app = new WebhookProvider();
        this.agreements = new AgreementProvider(agreementPath);
        this.smooch = new SmoochAdapter();
        this.dataProvider = new DataProvider();

        this.output = new OutputProvider();

        this.userState = {};
        this.userCurrentQuestion = {};

        this.registerHandlers();
    }
    registerHandlers() {
        PubSub.subscribe('conversation:start',(topic,data) => this.handleConversationStart(topic, data));
        PubSub.subscribe('postback',(topic,data) => this.handlePostback(topic, data));
        PubSub.subscribe('start.asking.questions',(topic,data) => this.startAskingQuestions(topic, data));
        PubSub.subscribe('ready.to.ask', (topic,data) => this.keepAsking(topic,data));
        PubSub.subscribe('ask.current.question', (topic, data) => this.askCurrentQuestion(data));
        PubSub.subscribe('message:appUser', (topic, data) => this.parseResponse(topic, data));
        PubSub.subscribe('question.done', (topic, data) => this.questionDone(topic, data));
    }

    handleConversationStart(topic, data) {
        this.resetUserState(data.userId);
        this.smooch.sendMessage(data.userId, 'Hallo! Welke overeenkomst wil je maken?', this.agreements.buttonsFromAgreements());
    }
    handlePostback(topic, data) {
        this.resetUserState(data.userId);
        let pl = data.message.postbacks[0].action.payload;
        if(pl.includes('setAgreement')) {
            let parts = pl.split(':');
            this.smooch.sendMessage(data.userId, "Oei.. daar komen wel een paar vragen bij kijken. Laten we snel beginnen 🚀", []);
            PubSub.publish('start.asking.questions',{
                userId: data.userId,
                agreement: parts[1],
            });
        }
    }
    questionDone(topic, userId) {
        console.log("DONE", this.userState[userId]);
        this.smooch.sendMessage(userId, "We zijn klaar en genereren je contract! 👍")

        let md = this.output.compileMd(userId, this.userState[userId]);
        let html = this.output.compileHtml(userId, this.userState[userId]);
        let htmlUrl =  e.APPLICATION_URL + '/' + html;
        let mdUrl = e.APPLICATION_URL + '/' + md;
        

        this.smooch.sendMessage(userId, "Hier issie dan: \r\n\r\nOrigineel:"  + htmlUrl + "\r\n\r\nEditor:https://stackedit.io/viewer#!url=" + mdUrl);

    }
    async parseResponse(topic, data) {
        let uid = data.userId;
        // console.log("gotresponse", topic, data);
        // await this.smooch.sendMessage(uid, "Bedankt voor het antwoord, we gaan door met de volgende!");

        //Zet het antwoord in de data
        let response = data.message.messages[0].text;
        this.persistResponseInData(uid, response)
        //Unset zodat de volgende vraag gesteld kan worden
        delete this.userCurrentQuestion[uid];
        //Vraag de volgende vraag
        PubSub.publish('ready.to.ask', uid);
    }
    persistResponseInData(userId, response) {
        let finalPath = '';
        if(this.userCurrentQuestion[userId].path != '') {
            finalPath =  this.userCurrentQuestion[userId].path + "." + this.userCurrentQuestion[userId].key;
            console.log("LOGGING:"  + finalPath);
        } else {
            finalPath = this.userCurrentQuestion[userId].key;
        }

        this.dataProvider.set(this.userState[userId].data, finalPath, response)
        return true;
    }
    askCurrentQuestion(data) {
        this.smooch.sendMessage(data.userId, data.question);
    }
    async keepAsking(topic, data) {
        await this.traverseDataObject(data,this.userState[data].data, "")
        if(typeof this.userCurrentQuestion[data] === 'undefined') {
            PubSub.publish('question.done', data)
        }
    }
    async traverseDataObject(userId, data, path) {
        for (const [key, value] of Object.entries(data)) {
            if(typeof this.userCurrentQuestion[userId] === 'undefined') {
                if(typeof value === 'object' && value !== null) {
                    let finalPath = (path == '') ? key : path + "." + key;
                    this.traverseDataObject(userId, value, finalPath);
                    if(typeof value.question !== 'undefined') {
                        this.userCurrentQuestion[userId] = {
                            question: value.question,
                            key: key,
                            path: path
                        } 
                        PubSub.publish('ask.current.question', {userId: userId, data: data, path:path, question: value.question});
                    }
                }
            }
        } 

    }
    async startAskingQuestions(topic,data) {
        this.parser = new AgreementParser(data.agreement);
        this.userState[data.userId] = {
            data: await this.dataProvider.fixData(this.parser.data),
            userId: data.userId,
            agreement: data.agreement,
            agreementText: this.parser.agreementText
        };
        PubSub.publish('ready.to.ask', data.userId);
    }
    resetUserState(userId) {
        delete this.userState[userId];
    }

}

let main = async function() {
    try {
        let application = new Application();
    } catch(e) {
        console.error(e);
    }
}

main();

