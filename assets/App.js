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

        let controllerInstance = new controller();

        if (controllerInstance.constructor.name === 'Promise') {
            return controllerInstance.then((data) => {
                let promisedController = this.findConstructor(data);

                if (!promisedController) {
                    throw Error('Promise for route ' + path + ' did not return a constructor');
                }

                this.routes[path] = promisedController;

                return this.handle(path);
            });
        }

        return controllerInstance;
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
