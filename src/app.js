import Renderer from "./js/Renderer";
import Storage from "./js/Storage";
import Controller from "./js/Controller";
import Fetcher from "./js/Fetcher";

import './styles/styles.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css';

export default (async function () {
    let
        fetcher = new Fetcher(),
        storage = new Storage(await fetcher.getData()),
        render = new Renderer(),
        controller = new Controller(storage, render);

    controller.init();
}());
