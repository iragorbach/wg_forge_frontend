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
        this.renderer.tableBody(this.storage.state.orders);
        this.renderer.statistic(this.calculateStatistic());
        this.addUserInfoListener();
    }

    renderHead() {
        this.renderer.header(this.storage.state.sort, this.storage.state.query);
        this.renderer.selectCurrency(this.storage.state.currencies);
        this.addSortingListener();
        this.addSearchListener();
        this.addChangeCurrencyListener();
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
                    self.renderHead();
                    self.renderBody();
                }
            });
        });
    }

    addChangeCurrencyListener() {
        let self = this;

        document.getElementById('exampleFormControlSelect1').addEventListener('change',function (e) {
            self.changeOrderAmount(e.target.value);
            self.renderBody();
        });
    }


    changeOrderAmount(currency) {
        let currencyRate = this.storage.state.currencies[currency];

        this.storage.state.orders.forEach(value => {
            value.currentAmount = parseFloat((value.orderAmount * currencyRate).toFixed(2));
            value.currency = currency;
        });
    }

    search(query) {
        this.storage.state.orders = this.storage.defaultData.orders;
        this.storage.state.query = query;

        if (query) {
            let orders = [];

            this.storage.state.orders.map(value => {
                if (
                    value.userInfo.toLowerCase().indexOf(query.toLowerCase()) !== -1
                    || value.transactionId.indexOf(query) !== -1
                    || value.orderAmount.toString().indexOf(query) !== -1
                    || value.cardType.indexOf(query) !== -1
                    || value.location.toLowerCase().indexOf(query.toLowerCase()) !== -1
                ) {
                    orders.push(value);
                }
            });

            this.storage.state.orders = orders;
        }

        if (this.storage.state.sort) {
            this.sortByField(this.storage.state.sort);
        }
    }

    sortByField(field) {
        this.storage.state.sort = field;

        this.storage.state.orders.sort((a, b) => {
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
        let
            orders = this.storage.state.orders,
            statistic = {
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

        if (orders.length) {
            statistic.ordersCount = orders.length;

            let sortedOrders = orders;

            sortedOrders.sort((a, b) => {
                return parseFloat(a['orderAmount']) - parseFloat(b['orderAmount']);
            });

            orders.forEach(value => {
                statistic.ordersTotal += parseFloat(value.orderAmount);

                if (value.user.gender === 'Male') {
                    statistic.totalMale += value.orderAmount;
                    statistic.countMale += 1;
                } else {
                    statistic.totalFemale += value.orderAmount;
                    statistic.countFemale += 1;
                }
            });

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
