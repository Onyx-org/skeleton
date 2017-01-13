import HelloService from '../Services/HelloService.js';

export default class Hello {
    constructor(name = 'World') {
        this.helloService = new HelloService();
        this.name = name;
    }

    sayHello() {
        return this.helloService.sayHello(this.name);
    }
}
