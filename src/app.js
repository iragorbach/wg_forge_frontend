const
    container = document.getElementById("app"),
    cardRegex = /^(\d{2})\d(?=\d{4})|\d(?=\d{4})/gm;

function fillTableHead() {
    container.innerHTML = `
            <table>
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

}

function fillTableRow(row) {
    const tableBody = document.getElementById("orders-body");
    tableBody.innerHTML +=
        `<tr id="order_${row.id}">
                            <td>${row.transaction_id}</td>
                            <td>${row.user_id}</td>
                            <td>${row.transaction_id}</td>
                            <td>${row.transaction_id}</td>
                            <td>${row.transaction_id}</td>
                            <td>${row.transaction_id}</td>
                            <td>${row.order_country} (${row.order_ip})</td>
                        </tr>`
    ;
}

function formatDate (date) {
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/')
        + ' '
        + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
}


export default (async function () {
    fillTableHead();
    const data = await getData();
    console.log(data);
    data.orders.forEach(value => {
        fillTableRow(value);
    })
}());
