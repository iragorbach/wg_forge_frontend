export default (function () {
    let container = document.getElementById("app");
    const cardRegex = /^(\d{2})\d(?=\d{4})|\d(?=\d{4})/gm;

    const fillOrders = () => {
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
        let tableBody = document.getElementById("orders-body");

        fetch('api/orders.json')
        // .then(function(response) {
        //      return response.json();
        // })
            .then(response => response.json())
            .then(data => {
                data.forEach(value => {
                    tableBody.innerHTML +=
                        `<tr id="order_${value.id}">
                            <td>${value.transaction_id}</td>
                            <td>${value.user_id}</td>
                            <td>${formatDate(new Date(value.created_at*1000))}</td>
                            <td>$ ${value.total}</td>
                            <td>${value.card_number.replace(cardRegex, `$1*`)}</td>
                            <td>${value.card_type}</td>
                            <td>${value.order_country} (${value.order_ip})</td>
                        </tr>`
                })
            })
    };

    const formatDate = (date) => {
           return [date.getDate(), date.getMonth()+1, date.getFullYear()].join('/')
               +' '
               + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
    };

    fillOrders();
}());
