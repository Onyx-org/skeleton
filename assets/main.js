import 'core-js/es6/promise';
import 'core-js/es6/object';
import 'core-js/es6/function';
import 'bootstrap';
import 'sass/vendor.scss';
import 'sass/main.scss';
import App from 'App';
import HomeController from 'Controllers/Home';
import HelloController from 'Controllers/Hello';

let app = new App();

app.registerRoute('home', HomeController);
app.registerRoute('hello', HelloController);

document.addEventListener("DOMContentLoaded", () => {
    app.handle(document.getElementsByTagName('html')[0].dataset.route);
});
