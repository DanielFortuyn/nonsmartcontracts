class DataProvider {
    
    async fixData(dataObject) {
        dataObject = this.fixMoment(dataObject);
        // if('partij1' in dataObject && 'hierna' in dataObject.partij1) {
        //     this.setCaseData(dataObject.partij1.hierna, dataObject.partij1);
        // }
        // if('partij2' in dataObject && 'hierna' in dataObject.partij2) {
        //     this.setCaseData(dataObject.partij2.hierna, dataObject.partij2);
        // }
        return this.traverseData(dataObject);
    }

    fixMoment(dataObject) {
        let momentRegexp = /moment\(\'(.*)\'\)/;
        for(var i in dataObject) {
            let result = momentRegexp.exec(dataObject[i]);
            if(result) {
                dataObject[i] = moment(result[1]).locale('nl',locale).format('LL');
            }
            //Scheisse recursie
            if(typeof dataObject[i] == "object") {
                dataObject[i] = this.fixMoment(dataObject[i]);
            }
        }
        return dataObject;
    }
    setCaseData(key, data)  {
        this.data[key] = data;
        this.data[key.toLowerCase] = data;
    }
    mapType(type) {
        if(type == 'bool') {
            return 'confirm'
        }
        return type || 'text';
    }
    set(obj, str, val) {
        str = str.split(".");
        while (str.length > 1)
            obj = obj[str.shift()];
        return obj[str.shift()] = val;
    }
    async traverseData(obj, path = '') {
        let questions = [];
        for (const [key, val] of Object.entries(obj)) {
            if(obj[key]) {
                if(obj[key].question) {
                    questions.push({
                        'name': key,
                        'message': obj[key].question || key,
                        'question': obj[key],
                        'type': this.mapType(obj[key].type),
                        'path': path,
                        'depends': obj[key].depends || [],
                        'when': (currentAnswers) => {
                            let shouldAsk = true;
                            if(obj[key].depends) {
                                obj[key].depends.forEach(function(item) {
                                    if(typeof currentAnswers[item] != undefined) {
                                        if(currentAnswers[item] == false) {
                                            shouldAsk = false;
                                        }
                                    }
                                });
                            }   
                            return shouldAsk;
                        }
                    });
                }        
            }
            if (typeof obj[key] === 'object' &&  obj[key] !== null) {
                this.traverseData(obj[key], path + '.' + key);
            }
        }
        return obj;
    }

}
export default DataProvider