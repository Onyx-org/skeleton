export default class App {
    constructor() {
        this.routes = {};
    }

    registerRoute(name, controller) {
        if (!this.findConstructor(controller)) {
            throw Error('Could not find a valid constructor for route ' + name);
        }

        this.routes[name] = controller;
    }

    handle(path) {
        if (typeof this.routes[path] === 'undefined') {
            return;
        }

        let controller = this.findConstructor(this.routes[path]);

        if (!controller) {
            throw Error('Could not find a valid constructor for route ' + path);
        }

        return new controller();
    }

    findConstructor(data) {
        if (data.constructor.name === 'Function') {
            return data;
        }

        if (data.constructor.name === 'Object' && typeof data.default !== 'undefined') {
            return data.default;
        }

        return;
    }
}
