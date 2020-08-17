import SmoochAdapter from './adapters/smooch.js'
import AgreementProvider from './providers/agreement.js';
import FileParser  from './parsers/file.js';
import dotenv from 'dotenv';
import WebhookProvider from './providers/webhook.js';
import PubSub from 'pubsub-js'
import DataProvider from './providers/data.js';
import OutputProvider from './providers/output.js';
import {config}  from './providers/config.js';
import Agreement from './container/agreement.js';

class Application {
    constructor() {
        this.config = config;

        this.app = new WebhookProvider();
        this.agreements = new AgreementProvider(config.env.AGREEMENT_PATH || './agreements');
        this.smooch = new SmoochAdapter();
        this.dataProvider = new DataProvider();
        this.parser = new FileParser();

        this.userState = {};
        this.registerHandlers();
    }
    registerHandlers() {
        PubSub.subscribe('conversation:start',(topic,data) => this.handleConversationStart(topic, data));
        PubSub.subscribe('message:appUser', (topic, data) => this.parseResponse(topic, data));
        PubSub.subscribe('postback',(topic,data) => this.handlePostback(topic, data));
        PubSub.subscribe('',(topic,data) => this.setAgreement(topic, data));
        PubSub.subscribe('ready.to.ask', (topic,data) => this.readyToAsk(topic,data));
        // PubSub.subscribe('ask.current.question', (topic, data) => this.askCurrentQuestion(data));
        PubSub.subscribe('questions.done', (topic, data) => this.questionDone(topic, data));
    }
    handleConversationStart(topic, data) {
        this.resetUserState(data.userId);
        this.smooch.sendMessage(data.userId, 'Hallo! Welke overeenkomst wil je maken?', this.agreements.buttonsFromAgreements());
    }
    handlePostback(topic,data) {
        this.setAgreement(data);
    }
    setAgreement(data) {
        this.resetUserState(data.userId);
        let pl = data.message.postbacks[0].action.payload;
        if(pl.includes('setAgreement')) {
            let parts = pl.split(':')
            // this.smooch.sendMessage(data.userId, "Oei.. daar komen wel een paar vragen bij kijken. Laten we snel beginnen 🚀", []);
            this.initializeAgreement(data.userId, parts[1]);
        }
    }

    async initializeAgreement(userId,agreementName) {
        let file = await this.parser.parseFile(userId, agreementName);
        this.output = new OutputProvider();
        await this.output.init();
        this.userState[userId] = new Agreement(agreementName, userId, file.text, file.data);
        this.userState[userId].compiled = this.output.preProcess(this.userState[userId]);

        PubSub.publish('ready.to.ask', userId);
    }

    questionDone(topic, userId) {
        console.log("DONE", this.userState[userId]);
        // this.smooch.sendMessage(userId, "We zijn klaar en genereren je contract! 👍")

        let md = this.output.compileMd(userId, this.userState[userId]);
        let html = this.output.compileHtml(userId, this.userState[userId]);
        let htmlUrl =  this.config.env.APPLICATION_URL + '/' + html;
        let mdUrl = this.config.env.APPLICATION_URL + '/' + md;
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
        PubSub.publish('ready.to.ask', uid);
    }
    persistResponseInData(userId, response) {
        let finalPath = '';
        let agreement = this.userState[userId]; 
        if(agreement.currentQuestion.path != '') {
            finalPath =  agreement.currentQuestion.path + "." + agreement.currentQuestion.key;
            console.log("LOGGING:"  + finalPath);
        } else {
            finalPath = agreement.currentQuestion.key;
        }
        agreement.provideAnswer(finalPath, response);
        return true;
    }
    async readyToAsk(topic, data) {
        let question = this.userState[data].fetchQuestion();
        if(typeof question === 'undefined') {
            PubSub.publish('questions.done', data)
        }   else {
            this.smooch.sendMessage(data, question.question);
        }
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

