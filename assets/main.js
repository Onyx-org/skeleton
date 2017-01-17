import 'bootstrap';
import 'sass/vendor.scss';
import 'sass/main.scss';
import App from 'App';
import HomeController from 'Controllers/Home';

let app = new App();

// Simple controller
app.registerRoute('home', HomeController);

// Async controller bundled separately.
// The third parameter of require.ensure is the chunk name that webpack will create.
// The name "something.async" allows it not to be loaded in the template.
app.registerRoute('hello', () => require.ensure([], function(require) {
    return require('Controllers/Hello');
}, 'hello.async'));

document.addEventListener("DOMContentLoaded", () => {
    app.handle(document.getElementsByTagName('html')[0].dataset.route);
});
