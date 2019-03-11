import Renderer from "./js/Renderer";
import Storage from "./js/Storage";
import Controller from "./js/Controller";
import Fetcher from "./js/Fetcher";

import './styles/styles.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css';

export default (async function () {
    let
        storage = new Storage({
            orders: await Fetcher.getData(),
            currencies: await Fetcher.getCurrencies(),
            sort: '',
            query: ''
        }),
        renderer = new Renderer(),
        controller = new Controller(storage, renderer);

    controller.init();
}());
