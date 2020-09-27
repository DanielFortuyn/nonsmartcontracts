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
        PubSub.subscribe('ready.to.ask', (topic,data) => this.readyToAsk(topic,data));
        // PubSub.subscribe('ask.current.question', (topic, data) => this.askCurrentQuestion(data));
        PubSub.subscribe('questions.done', (topic, data) => this.questionDone(topic, data));
    }
    handleConversationStart(topic, data) {
        this.resetUserState(data.userId);
        this.smooch.sendMessage(data.userId, "Hallo! Welke overeenkomst wil je maken? Als je wilt stoppen, kun je altijd 'stop' zeggen. \r\n\r\nOok kun je alle modelovereenkomsten bekijken op:  https://github.com/DanielFortuyn/nonsmartcontracts ", this.agreements.buttonsFromAgreements());
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
        this.userState[userId].cleanData();
        this.smooch.sendMessage(userId, "We zijn klaar en genereren je contract! 👍")

        let md = this.output.compileMd(userId, this.userState[userId]);
        let html = this.output.compileHtml(userId, this.userState[userId]);
        let htmlUrl =  this.config.env.APPLICATION_URL + '/' + html;
        let mdUrl = this.config.env.APPLICATION_URL + '/' + md;
        let modelUrl = "https://github.com/DanielFortuyn/nonsmartcontracts/tree/chat/agreements/dutch/" + this.userState[userId].name;
        this.smooch.sendMessage(userId, "Je kunt je contract bekijken: \r\nPrinten:\r\n"  + htmlUrl + "\r\n\r\nEditor: https://stackedit.io/viewer#!url=" + mdUrl + "\r\nModel:\r\n" + modelUrl);
        delete this.userState[userId];
    }
    checkForStop(data) {
        if(data.message.messages[0].text == 'stop') {
            console.log('conversation stop');
            PubSub.publish('conversation:start', data);
        }
    }
    async parseResponse(topic, data) {
        let uid = data.userId;
        this.checkForStop(data);
        if(this.userState[uid]) {
            // console.log("gotresponse", topic, data);
            // await this.smooch.sendMessage(uid, "Bedankt voor het antwoord, we gaan door met de volgende!");
            //Zet het antwoord in de data
            let response = (data.message.messages[0].payload) ? data.message.messages[0].payload : data.message.messages[0].text;
            console.log(response);
            if(response == 'Ja' ||  response == 'ja') {
                response = true;
            }
            if(response == 'Nee' || response == 'nee') {
                response = false;
            }

            this.persistResponseInData(uid, response)
            //Unset zodat de volgende vraag gesteld kan worden
            PubSub.publish('ready.to.ask', uid);
        }
    }
    persistResponseInData(userId, response) {
        let agreement = this.userState[userId]; 
        let path = this.createPath(agreement.currentQuestion.path, agreement.currentQuestion.key);
        agreement.provideAnswer(path, response);
        return true;
    }
    createPath(path, key) {
        let finalPath = '';
        if(path != '') {
            finalPath = path + '.' + key;
        } else {
            finalPath = key;
        }
        return finalPath;
    }
    async readyToAsk(topic, data) {
        let agreement = this.userState[data];
        let question = agreement.fetchQuestion();
        if(typeof question === 'undefined') {
            PubSub.publish('questions.done', data)
        }   else {
            //Compare question with depends
            if(question.depends) {
                console.log("DEPENDS VALUE", agreement.get(agreement.data, question.depends));
                if(!agreement.get(agreement.data, question.depends)) {
                    console.log('SKIPPING');
                    PubSub.publish('ready.to.ask', data)
                } else {
                    this.sendQuestion(data, question)
                }
            } else {
                this.sendQuestion(data, question)
            }
        }
    }
    sendQuestion(data, question) {
        if(question.options.length != 0) {
            this.smooch.sendMessage(data, question.question, question.options);
        } else {
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

