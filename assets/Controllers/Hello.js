export default class Hello {
    constructor(name = 'World') {
        this.name = name;
        this.sayHello(this.name);
    }

    sayHello() {
        console.log('Hello ' + this.name);
    }
}
