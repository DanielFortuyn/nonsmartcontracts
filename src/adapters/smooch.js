import SmoochCore from 'smooch-core';
import dotenv from 'dotenv';

dotenv.config();
const e = process.env;

class SmoochAdapter {
    constructor() {
        this.smooch = new SmoochCore({
            keyId: e.SMOOCH_KEY,
            secret: e.SMOOCH_SECRET,
            scope: 'app', // account, app, or appUser
        });
    }
    triggerHandler() {
        switch(smoochMessage.trigger) {
            case 'conversation:start':
                this.handleConversationStart();
                return smoochMessage.appUser._id;
        }
    }
    agreementsToMessage() {
        let actions = [];
        this.agreements.forEach(function(val) {
            actions.push({
                type: 'postback',
                text: val.key || 'null',
                payload: val.key || 'null'
            });
        });
        return actions;  
    }
    async sendMessage(userId, message, actions = []) {
        await this.smooch.appUsers
        .sendMessage({
            userId: userId,
            message: {
                type: 'text',
                text: message,
                role: 'appMaker',
                actions: actions
            }
        })
        .then((response) => {
            // console.log('API RESPONSE:\n', response);
        })
        .catch((err) => {
            console.log('API ERROR:\n', err);
        });
    }
}

export default SmoochAdapter