import { resolve } from 'universal-router';

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
            return 'Hello ' + name;
        }
    }
]

resolve(routes, { path: window.location.pathname }).then(result => {
    console.log(result);
});
