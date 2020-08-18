import PubSub from 'pubsub-js'
import moment from 'moment';

class DataProvider {

    cleanAgreementData(obj) {
        this.fixHereafter(obj)

        for (const [key, val] of Object.entries(obj)) {
            //Check moment
            obj[key] = this.fixMoment(key, val);
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                // this.cleanData(obj[key]);
            }
        }
    }

    fixHereafter(dataObject) {
        if ('partij1' in dataObject && 'hierna' in dataObject.partij1) {
            this.setCaseData(dataObject, dataObject.partij1.hierna, dataObject.partij1);
        }
        if ('partij2' in dataObject && 'hierna' in dataObject.partij2) {
            this.setCaseData(dataObject, dataObject.partij2.hierna, dataObject.partij2);
        }
    }

    fixMoment(key, val) {
        let momentRegexp = /moment\(\'(.*)\'\)/;
        let result = momentRegexp.exec(val);
        if (result) {
            return moment(result[1]).locale('nl').format('LL');
        }
        return val;
    }
    setCaseData(dataObject, key, data) {
        dataObject[key] = data;
        dataObject[key.toLowerCase()] = data;
    }

}
export default DataProvider