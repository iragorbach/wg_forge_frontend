import 'bootstrap';

const
    container = document.getElementById("app"),
    cardRegex = /^(\d{2})\d(?=\d{4})|\d(?=\d{4})/gm;

let
    initialState = [],
    state = [],
    filters = {
        search: '',
        filter: null,
    }
;

function fillTableHead() {
    container.innerHTML = `
            <table class="table">
                <thead>
                    <tr id="table-header">
                        <th data-info="transactionId">Transaction ID</th>
                        <th data-info="userInfo">User Info</th>
                        <th data-info="orderDate">Order Date</th>
                        <th data-info="orderAmount">Order Amount</th>
                        <th data-info="cardNumber">Card Number</th>
                        <th data-info="cardType">Card Type</th>
                        <th data-info="location">Location</th>
                    </tr>
                </thead>
                <tbody id="orders-body"></tbody>
            </table>`
    ;
}

async function getInitialState() {
    let data = {
            users: [],
            orders: [],
            companies: []
        },
        users = {},
        companies = {};

    await Promise.all([
        fetch('api/users.json').then(response => response.json()),
        fetch('api/orders.json').then(response => response.json()),
        fetch('api/companies.json').then(response => response.json())
    ])
        .then(response => {
            data.users = response[0];
            data.orders = response[1];
            data.companies = response[2];
        })
        .then(() => {
            data.users.forEach(value => {
                users[value.id] = value;
            });
            data.companies.forEach(value => {
                companies[value.id] = value;
            });
            data.users = users;
            data.companies = companies;

            data.orders.map(value => {
                value['user'] = data.users[value.user_id];
                value['user']['title'] = value['user']['gender'] === 'Male' ? 'Mr. ' : 'Ms. ';
                value['user']['company'] = data.companies[value.user.company_id];
            });

            data.orders.forEach(value => {
                initialState.push({
                    id: value.id,
                    transactionId: value.transaction_id,
                    userInfo: value.user.first_name + ' ' + value.user.last_name,
                    user: {
                        title: value.user.title,
                        birthday: value.user.birthday ? formatDate(new Date(value.user.birthday * 1000)) : '',
                        avatar: value.user.avatar || '',
                        company: value.user.company ? {...value.user.company, url: value.user.company.url || ''} : null
                    },
                    orderDate: formatDate(new Date(value.created_at * 1000)),
                    orderAmount: parseFloat(value.total),
                    cardNumber: parseInt(value.card_number),
                    cardType: value.card_type,
                    location: `${value.order_country} (${value.order_ip})`
                });
            });

            state = initialState;
        })
    ;
}

function addEventListeners() {
    let showInfo = document.getElementsByClassName('show-info');

    Array.prototype.slice.call(showInfo).forEach(value => {
        value.addEventListener('click', function (e) {
            e.preventDefault();
            let userDetails = this.nextElementSibling;
            userDetails.style.display === 'none'
                ? userDetails.style.display = 'block'
                : userDetails.style.display = 'none';
        })
    });

    let tableHeader = document.getElementById('table-header');
    // console.log('tableHeader', tableHeader);

    Array.prototype.slice.call(tableHeader.children).forEach(value => {
        value.addEventListener('click', function (e) {
            e.preventDefault();
            let field = this.getAttribute('data-info');
            sortByField(field);
            render();
        })
    })


}

function sortByField(field) {
    console.log(field);
    state.sort((a, b) => {
        if (a[field] < b[field]) {
            return -1;
        }
        if (a[field] > b[field]) {
            return 1;
        }
        return 0;
    });
}

function render() {
    const tableBody = document.getElementById("orders-body");
    tableBody.innerHTML = '';

    state.forEach(value => {
        tableBody.innerHTML +=
            `<tr id="order_${value.id}">
                            <td>${value.transactionId}</td>
                            <td class="user-data">
                                <a href="#" class="show-info">${value.user.title} ${value.userInfo}</a>
                                <div class="user-details" style="display:none">
                                    <p>${value.user.birthday}</p>
                                    <p><img src="${value.user.avatar}" width="100px"></p>
                                    ${value.user.company ? renderCompanyInfo(value.user.company) : ''}
                                </div>
                            </td>
                            <td>${value.orderDate}</td>
                            <td class="order-amount">$ ${value.orderAmount}</td>
                            <td>${value.cardNumber.toString().replace(cardRegex, `$1*`)}</td>
                            <td>${value.cardType}</td>
                            <td>${value.location}</td>
                        </tr>`
        ;
    });
}

function renderCompanyInfo(company) {
    return `<p>Company: <a href="${company.url}" target="_blank">${company.title}</a></p><p>${company.industry}</p>`;
}

function fillTable() {
    document.getElementById("orders-body").innerHTML += `
    <tr>
    <td>Orders Count</td>
    <td  colspan="6">${getOrdersCount()}</td>
</tr>
<tr>
    <td>Orders Total</td>
    <td  colspan="6">$ ${getOrdersTotal()}</td>
</tr>
<tr>
    <td>Median Value</td>
    <td  colspan="6">$ 593.72</td>
</tr>
<tr>
    <td>Average Check</td>
    <td  colspan="6">$ 611.16</td>
</tr>
<tr>
    <td>Average Check (Female)</td>
    <td  colspan="6">$ 395.18</td>
</tr>
<tr>
    <td>Average Check (Male)</td>
    <td  colspan="6">$ 692.15</td>
</tr>`
}

function getOrdersCount() {
    let table = document.querySelector('.table');
    let count = table.rows.length;
    return count;
}

function getOrdersTotal() {
    let ordersTotal = document.querySelectorAll('.order-amount');
}

function formatDate(date) {
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/')
        + ' '
        + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
}

export default (async function () {
    fillTableHead();
    await getInitialState();
    render();
    addEventListeners();
}());
