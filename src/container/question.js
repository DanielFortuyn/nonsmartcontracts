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
        this.question = question.question;
        this.key = key;
        this.path = path ;
        this.default = question.default;
        this.depends = question.depends || false;
        this.options = [];
        this.parseOptions(question.options);
    }

    parseOptions(options) {
        let self = this;
        if(typeof options != 'undefined') {
        options.forEach(function(item, index) {
            self.options.push(
                {
                    type:'reply',
                    text: item,
                    index: index,
                    payload: item
                }
            );
        });
        }
    }   
}
export default Question;