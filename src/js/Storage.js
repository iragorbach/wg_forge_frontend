export default class Storage {
    constructor(defaultData) {
        this.defaultData = defaultData || {};
        this.state = {...this.defaultData};
    }
}
