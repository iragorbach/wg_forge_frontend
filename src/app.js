import 'bootstrap';

import Renderer from "./js/Renderer";
import Storage from "./js/Storage";
import Controller from "./js/Controller";

async function getInitialState() {
    let data = {
            users: [],
            orders: [],
            companies: []
        },
        users = {},
        companies = {},
        state = [];

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
                state.push({
                    id: value.id,
                    transactionId: value.transaction_id,
                    userInfo: value.user.first_name + ' ' + value.user.last_name,
                    user: {
                        title: value.user.title,
                        gender: value.user.gender,
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

        })
    ;

    return state;
}

function formatDate(date) {
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/')
        + ' '
        + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
}

export default (async function () {
    let
        storage = new Storage(await getInitialState()),
        render = new Renderer(),
        controller = new Controller(storage, render);

    controller.init();
}());
