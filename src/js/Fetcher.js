export default class Fetcher {
    async getData() {
        let state = [];

        await Promise.all([
            fetch('api/users.json').then(response => response.json()),
            fetch('api/orders.json').then(response => response.json()),
            fetch('api/companies.json').then(response => response.json())
        ])
            .then(response => {
                return {
                    users: response[0],
                    orders: response[1],
                    companies: response[2]
                };
            })
            .then((data) => {
                state = this.format(data)
            })
        ;

        return state;
    }

    format(data) {
        let
            result = [],
            users = {},
            companies = {};

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
            result.push({
                id: value.id,
                transactionId: value.transaction_id,
                userInfo: value.user.first_name + ' ' + value.user.last_name,
                user: {
                    title: value.user.title,
                    gender: value.user.gender,
                    birthday: value.user.birthday ? this.formatDate(new Date(value.user.birthday * 1000)) : '',
                    avatar: value.user.avatar || '',
                    company: value.user.company ? {...value.user.company, url: value.user.company.url || ''} : null
                },
                orderDate: this.formatDate(new Date(value.created_at * 1000)),
                orderAmount: parseFloat(value.total),
                cardNumber: parseInt(value.card_number),
                cardType: value.card_type,
                location: `${value.order_country} (${value.order_ip})`
            });
        });

        return result;
    }

    formatDate(date) {
        return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/')
            + ' '
            + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
    }
}
