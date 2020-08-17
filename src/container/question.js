import template from 'handlebars';
import dotenv from 'dotenv';
import Handlebars from 'handlebars';
import marked from 'marked';
import fs from 'fs'
import YAML from 'yaml'
import { config } from '../providers/config.js'
import PubSub from 'pubsub-js'

let e = config.env;

class Question {
    constructor(key, question, path) {
        console.log(question);
        this.question = question.question;
        this.key = key;
        this.path = path ;
        this.default = question.default;
    }
}
export default Question;