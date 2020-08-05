
let helpers = {
    search: function (input, values, defaultValue) {
        input = input || '';
        return new Promise(function (resolve) {
            try {
                if (input == '') {
                    resolve([defaultValue]);
                } else {
                    var options = {
                        extract: function (el) {
                            return el.name;
                        }
                    }
                    var fuzzyResult = fuzzy.filter(input, values, options);
                    resolve(
                        fuzzyResult.map(function (el) {
                            return el.original;
                        })
                    );
                }
            } catch (e) {
                console.error(e);
            }
        });
    },
    handleQuestion: async function (name, questionObject) {
        return await inquirer.prompt({
            name: name,
            message: questionObject.question
        });
    },
    handleQuestions: function() {
        return inquirer.prompt(this.questions);
    },

    askAgreement: async function () {
        let self = this;
        return await inquirer.prompt([
            {
                name: 'agreement',
                type: "autocomplete",
                choices: self.agreements,
                source: function (answers, input) {
                    return self.search(input, self.agreements, self.agreements[0]);
                }
            },
        ])
    }
}
