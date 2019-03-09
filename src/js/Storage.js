export default class Storage {
    constructor(defaultData) {
        this.defaultData = defaultData || [];
        this.state = this.defaultData;
        this.sort = null;
        this.query = null;
    }
}

