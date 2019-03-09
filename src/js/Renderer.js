import {container, tableBodyId, tableHeadId, cardRegex} from "./Consts";

export default class Renderer {
    table() {
        container.innerHTML = `
                <table class="table">
            <thead id="${tableHeadId}"></thead>
            <tbody id="${tableBodyId}"></tbody>
        </table>
        `
    }

    header(filter, query) {
        document.getElementById(tableHeadId).innerHTML = `
            <tr id="table-header-title">
                <th data-info="transactionId">Transaction ID</th>
                <th data-info="userInfo">User Info</th>
                <th data-info="orderDate">Order Date</th>
                <th data-info="orderAmount">Order Amount</th>
                <th>Card Number</th>
                <th data-info="cardType">Card Type</th>
                <th data-info="location">Location</th>
                <th>Search:</th>
                <th><input type="text" id="search" value="${query || ''}"></th>
            </tr>`
        ;
        if (filter) {
            document.querySelectorAll(`[data-info='${filter}']`)[0].innerHTML += ' <span>&#8595;</span>';
        }
    }

    tableBody(rows) {
        let tableBody = '';

        rows.forEach(value => {
            tableBody +=
                `<tr id="order_${value.id}">
                            <td>${value.transactionId}</td>
                            <td class="user-data">
                                <a href="#" class="show-info">${value.user.title} ${value.userInfo}</a>
                                <div class="user-details" style="display:none">
                                    <p>${value.user.birthday}</p>
                                    <p><img src="${value.user.avatar}" width="100px"></p>
                                    ${value.user.company ? this.companyInfo(value.user.company) : ''}
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

        document.getElementById(tableBodyId).innerHTML = tableBody;
    }

    companyInfo(company) {
        return `<p>Company: <a href="${company.url}" target="_blank">${company.title}</a></p><p>${company.industry}</p>`;
    }

    statistic(statistic) {
        document.getElementById(tableBodyId).innerHTML +=
            `<tr>
                    <td>Orders Count</td>
                    <td colspan="6">${statistic.ordersCount}</td>
                </tr>
                <tr>
                    <td>Orders Total</td>
                    <td colspan="6">$ ${statistic.ordersTotal}</td>
                </tr>
                <tr>
                    <td>Median Value</td>
                    <td colspan="6">$ ${statistic.medianValue}</td>
                </tr>
                <tr>
                    <td>Average Check</td>
                    <td colspan="6">$ ${statistic.averageCheck}</td>
                </tr>
                <tr>
                    <td>Average Check (Female)</td>
                    <td colspan="6">$ ${statistic.averageCheckF}</td>
                </tr>
                <tr>
                    <td>Average Check (Male)</td>
                    <td colspan="6">$ ${statistic.averageCheckM}</td>
                </tr>`
    }
}
