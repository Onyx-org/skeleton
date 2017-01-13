import { resolve } from 'universal-router';

require('bootstrap');
require('./sass/vendor.scss');
require('./sass/main.scss');

const routes = [
    {
        path: '/',
        action: () => {
            return 'Home page';
        }
    },
    {
        path: '/hello/:name?',
        action: (context, { name = 'world' }) => {
            // Use require.ensure if you want to split something out of the main entry file
            // Suffix the chunk name with .async
            return require.ensure([], (require) => {
                const Hello = require('./Controllers/Hello.js').default;
                const helloController = new Hello(name);

                return helloController.sayHello();
            }, 'hello.async');
        }
    }
];

resolve(routes, { path: window.location.pathname }).then(result => {
    console.log(result);
});

