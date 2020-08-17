import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv';
import express from 'express';
import PubSub from 'pubsub-js'
dotenv.config();
let e = process.env;
const port = e.PORT || 8080;

class WebhookProvider {
    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.app.use(express.static('output'));
        this.app.get('/', (req, res) => res.send('Hello World!'))
        this.app.post('/', (req, res) => {
            this.inboundHandler(req.body);
            return res.send('ok');
        });
        this.app.listen(port, () => console.log(`Lexr telegram listening at http://localhost:${port}`))
    }
    inboundHandler(smoochMessage) {
        console.log(smoochMessage.trigger);
        PubSub.publish(smoochMessage.trigger, {
            userId: this.getUserId(smoochMessage),  
            message: smoochMessage
        });
        return 'ok';
    }
    getUserId(smoochMessage) {
        if(typeof smoochMessage.appUser != 'undefined' && typeof smoochMessage.appUser._id != 'undefined') {
            return smoochMessage.appUser._id;
        }
    }
    getApp() { 
        return this.app;
    }
}

export default WebhookProvider