import 'bootstrap';

const
    container = document.getElementById("app"),
    cardRegex = /^(\d{2})\d(?=\d{4})|\d(?=\d{4})/gm;

function fillTableHead() {
    container.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>User Info</th>
                        <th>Order Date</th>
                        <th>Order Amount</th>
                        <th>Card Number</th>
                        <th>Card Type</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody id="orders-body"></tbody>
            </table>`
    ;
}

async function getData() {
    let data = {
        users: [],
        orders: [],
        companies: []
    };

    await Promise.all([
        fetch('api/users.json').then(response => response.json()),
        fetch('api/orders.json').then(response => response.json()),
        fetch('api/companies.json').then(response => response.json())
    ])
        .then(response => {
            data.users = response[0];
            data.orders = response[1];
            data.companies = response[2];
        });

    return data;
    console.log(data);

}

function showInfo() {
    let userData = document.getElementsByClassName('user-data');
    let arr = Array.prototype.slice.call(userData);
    arr.forEach(value => {
       value.addEventListener('click', function (e) {
           e.preventDefault();
           console.log(e);
           let userDetails = this.childNodes[3];
           userDetails.style.display === 'none'
               ? userDetails.style.display = 'block'
               : userDetails.style.display = 'none';
       })
    });
}

function fillTableRow(row) {
    const tableBody = document.getElementById("orders-body");
    tableBody.innerHTML +=
        `<tr id="order_${row.id}">
                            <td>${row.transaction_id}</td>
                            <td class="user-data">
                                <a href="#" class="trest">${row.user.title} ${row.user.first_name} ${row.user.last_name}</a>
                                <div class="user-details" style="display:none">
                                    <p>${formatDate(new Date(row.user.birthday*1000))}</p>
                                    <p><img src="${row.user.avatar}" width="100px"></p>
                                    <p>Company: <a href="${row.user.company ? row.user.company.url : 'N/A' }" target="_blank">${row.user.company ? row.user.company.title : 'N/A' }</a></p>
                                    <p>Industry: Apparel / Consumer Services</p>
                                </div>
                            </td>
                            <td>${formatDate(new Date(row.created_at * 1000))}</td>
                            <td class="order-amount">$ ${row.total}</td>
                            <td>${row.card_number.replace(cardRegex, `$1*`)}</td>
                            <td>${row.card_type}</td>
                            <td>${row.order_country} (${row.order_ip})</td>
                        </tr>`
    ;
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
    console.log(ordersTotal);

}

function formatDate(date) {
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/')
        + ' '
        + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
}

export default (async function () {
    fillTableHead();
    const data = await getData();
    let users = {};
    let companies = {};
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

    console.log(data);
    data.orders.forEach(value => {
        fillTableRow(value);
    });
    fillTable();
    showInfo();
}());
