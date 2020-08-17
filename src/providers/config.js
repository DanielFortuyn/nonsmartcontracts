import dotenv from 'dotenv';
import PubSub from 'pubsub-js'
dotenv.config();

class Config {
    constructor() {
        let e = process.env;
        this.env = process.env;
        this.split = e.SPLITTER || "#-!-#";
        this.store = {};

    }
    set(key, value) {
        this.store[key] = value;
    }
}
export let config = new Config();