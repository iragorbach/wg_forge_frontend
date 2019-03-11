export default class Controller {
    constructor(storage, renderer) {
        this.storage = storage;
        this.renderer = renderer;
    }

    init() {
        this.renderer.table();
        this.renderHead();
        this.renderBody();
    }

    renderBody() {
        this.renderer.tableBody(this.storage.state);
        this.renderer.statistic(this.calculateStatistic());
        this.addUserInfoListener();
    }

    renderHead(field, query) {
        this.renderer.header(field, query);
        this.addSortingListener();
        this.addSearchListener();
    }


    addSearchListener() {
        let self = this;

        document.getElementById('search').addEventListener('input', function (e) {
            e.preventDefault();
            self.search(this.value);
            self.renderBody();
        });
    }

    addUserInfoListener() {
        let showInfo = document.getElementsByClassName('show-info');

        Array.prototype.slice.call(showInfo).forEach(value => {
            value.addEventListener('click', function (e) {
                e.preventDefault();
                let userDetails = this.nextElementSibling;
                userDetails.style.display === 'none'
                    ? userDetails.style.display = 'block'
                    : userDetails.style.display = 'none';
            });
        });
    }

    addSortingListener() {
        let self = this;
        let tableHeader = document.getElementById('table-header-title');

        Array.prototype.slice.call(tableHeader.children).forEach(value => {
            value.addEventListener('click', function (e) {
                e.preventDefault();
                let field = this.getAttribute('data-info');
                if (field) {
                    self.sortByField(field);
                    self.renderHead(field, self.storage.query);
                    self.renderBody();
                }
            });
        });
    }


    search(query) {
        this.storage.state = this.storage.defaultData;

        if (query) {
            let state = [];

            this.storage.state.map(value => {
                if (
                    value.userInfo.toLowerCase().indexOf(query.toLowerCase()) !== -1
                    || value.transactionId.indexOf(query) !== -1
                    || value.orderAmount.toString().indexOf(query) !== -1
                    || value.cardType.indexOf(query) !== -1
                    || value.location.toLowerCase().indexOf(query.toLowerCase()) !== -1
                ) {
                    state.push(value);
                }
            });

            this.storage.query = query;
            this.storage.state = state;
        }

        if (this.storage.sort) {
            this.sortByField(this.storage.sort);
        }
    }

    sortByField(field) {
        this.storage.sort = field;

        this.storage.state.sort((a, b) => {
            if (a[field] < b[field]) {
                return -1;
            }
            if (a[field] > b[field]) {
                return 1;
            }
            return 0;
        });
    }

    calculateStatistic() {
        let statistic = {
            ordersCount: 0,
            ordersTotal: 0,
            medianValue: 0,
            averageCheck: 0,
            totalMale: 0,
            countMale: 0,
            totalFemale: 0,
            countFemale: 0,
            averageCheckF: 0,
            averageCheckM: 0
        };

        if (this.storage.state.length) {
            statistic.ordersCount = this.storage.state.length;

            let sortedOrders = this.storage.state;

            sortedOrders.sort((a, b) => {
                return parseFloat(a['orderAmount']) - parseFloat(b['orderAmount']);
            });

            this.storage.state.forEach(value => {
                statistic.ordersTotal += parseFloat(value.orderAmount);

                if (value.user.gender === 'Male') {
                    statistic.totalMale += value.orderAmount;
                    statistic.countMale += 1;
                } else {
                    statistic.totalFemale += value.orderAmount;
                    statistic.countFemale += 1;
                }
            });
            console.log(statistic.medianValue);

            statistic.ordersTotal = statistic.ordersTotal.toFixed(2);
            statistic.averageCheck = (statistic.ordersTotal / statistic.ordersCount).toFixed(2);
            statistic.medianValue = sortedOrders[Math.floor(statistic.ordersCount / 2)]['orderAmount'];
            statistic.averageCheckM = (statistic.totalMale / statistic.countMale).toFixed(2);
            statistic.averageCheckF = (statistic.totalFemale / statistic.countFemale).toFixed(2);
        } else {
            statistic = {
                ordersCount: 'n/a',
                ordersTotal: 'n/a',
                medianValue: 'n/a',
                averageCheck: 'n/a',
                averageCheckF: 'n/a',
                averageCheckM: 'n/a'
            };
        }

        return statistic;
    }
}
