# Asset management

<!-- MarkdownTOC -->

- [Webpack](#webpack)
- [Commands](#commands)
- [Example](#example)
- [Routing](#routing)
    - [registerRoute\(routeName, callback\)](#registerrouteroutename-callback)
- [Controllers](#controllers)
- [Optimization: Script splitting](#optimization-script-splitting)
    - [Entrypoints](#entrypoints)
    - [Asynchronous loading](#asynchronous-loading)
- [How does webpack communicates with the application?](#how-does-webpack-communicates-with-the-application)

<!-- /MarkdownTOC -->

## Webpack

- Packaging of used assets and nothing else
- Detection of assets based on their use in the code
- Automatic rewriting of files import urls acccording to final public path
- Vendor and common code splitting
- Optimized for browser caching
- Asynchronous depedencies
- Minification
- Tree shaking
- Source maps
- ~~Dev server with automatic reload~~

*@TODO*:
- I18N
- Tests
- Image optimization

## Commands

- **make webpack**: Builds assets for development
- **make webpack-prod**: Builds assets for production
- ~~**make webpack-watch**~~: ~~Builds assets and automatically rebuilds and reload if a file changes~~

## Example

All you need to be able to import any file into your javascript is to have a loader configured for that file type.

Webpack looks into those folders for modules :
- /assets
- /node_modules

**main.js**
```js
// Polyfills required by webpack
import 'core-js/es6/promise';
import 'core-js/es6/object';
import 'core-js/es6/function';
// Import bootstrap from node_modules
import 'bootstrap';
// Sass file for vendor stuff
import 'sass/vendor.scss';
// Index sass file for the application
import 'sass/main.scss';
// App class handles the routing
import App from 'App';
// Importing a controller
import HomeController from 'Controllers/Home';

let app = new App();

// Binding home route to HomeController
app.registerRoute('home', HomeController);

document.addEventListener("DOMContentLoaded", () => {
    // Executing the controller matching the current route
    app.handle(document.getElementsByTagName('html')[0].dataset.route);
});
```

## Routing

The router executes a controller based on a route ID parameter set by the backend in the HTML. This is a simple [DOM-Based Routing](https://www.paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/) for multi pages applications.

**main.js**
```js
import App from 'App';
import HomeController from 'Controllers/Home';

let app = new App();

app.registerRoute('home', HomeController);

document.addEventListener("DOMContentLoaded", () => {
    // Routing based on html[data-route] attribute
    app.handle(document.getElementsByTagName('html')[0].dataset.route);
});
```

### registerRoute(routeName, callback)
- **routeName**: The name of the route
- **callback**: A constructor (class|function)

## Controllers

A controller is either a `Class` or a `Function`.

```js
export default myController {
    constructor() {
        // Init function
        this.sayHello();
    }

    sayHello() {
        console.log('Hello');
    }
}
```

```js
export default function sayHello() {
    // jQuery globally available
    $('html').text('Hello');
}
```

## Optimization: Script splitting

Webpack bundles everything in one file. You may find that this needlessly slows down the first load and that it would be better to split the project into multiple files.

### Entrypoints

Webpack generates one file per declared `entrypoint`. You can create a new `entrypoint` to separate a part of your project.

In the example below we create 2 entrypoints. One for the public area and one for the admin area.

**webpack.common.js**
```js
...
entry: {
    main: './assets/main',
    admin: './assets/admin'
},
...
```

Webpack is configured to group common dependencies into a common chunk file for better performance. You need to tell webpack about your new entrypoint so it can take it into account.

**webpack.prod.js**
```js
plugins: [
        ...
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            chunks: ['main', 'admin'], // Update this line with your entrypoint
            minChunks: 2
        }),
        ...
    ]
```

If your entrypoint uses a fair amount of external dependencies it might be useful to bundle them separately to get better browser caching.

```js
plugins: [
        ...
        // This must be placed after the global common chunk*
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor.admin',
            chunks: ['admin'],
            minChunks: module => /node_modules\//.test(module.resource)
        }),
        ...
    ]
```

*The order in which `CommonsChunkPlugin` are declared is important. A module that has already been extracted by on `CommonsChunkPlugin` cannot be extracted anymore (unless the `CommonsChunkPlugin` call is configured to extract from previously generated `CommonsChunkPlugin` chunks).

### Asynchronous loading

Webpack allows you to create a separate file when requiring a dependency. No need here to define a new entrypoint.

**[require.ensure(dependencies: String[], callback: function(require), chunkName: String)](https://webpack.js.org/guides/code-splitting-require/#require-ensure-)**

```js
// The module b will be separated to his own file
require.ensure([], function(require){
    require('b');
});

// The module b will be separatd to the file named mon-super-fichier-async
require.ensure([], function(require){
    require('b');
}, 'mon-super-fichier-async');

// require.ensure returns a Promise
require.ensure([], function(require){
    return require('google-maps');
}, 'maps-async').then(function(GoogleMapsLoader) {
    GoogleMapsLoader.load(function(google) {
        new google.maps.Map(el, options);
    });
});

// Equivalent to
require.ensure([], function(require){
    var GoogleMapsLoader = require('google-maps');
    GoogleMapsLoader.load(function(google) {
        new google.maps.Map(el, options);
    });
}, 'maps-async');
```

When you use `require.ensure` you must make sure that you do not add the generated js file to the HTML. Webpack will load the file by himself when needed.
```twig
{% for asset in webpackAssets(includePattern='*.js', excludePattern='my-async-file') %}
    <script src="{{ asset }}"></script>
{% endfor %}
```

**The project is configured to exclude any file that ends with async**.
Suffix your async dependencies chunk filename with async to automatically exclude them from the HTML.
```twig
{% for asset in webpackAssets(includePattern='*.js', excludePattern='webpack.js, *async.js') %}
    <script src="{{ asset }}"></script>
{% endfor %}
```

## How does webpack communicates with the application?

Webpack generates a manifest of all the files it has generated. That file is read by the backend and it is used to inject the necessary files into the HTML.

The backend handles the manifest with the following classes:

- [WebpackManifest](../src/Webpack/WebpackManifest.php) : `webpack.manifest` service provides an object representing the loaded manifest
- [TwigWebpackExtension](../src/Twig/TwigWebpackExtension.php) : Provides variables and functions so the views can exploit the manifest:
    + **webpackAssets(include, exclude)**<br>Twig function to select assets with a glob selector
    + **webpackAsset(name)**<br>Twig function to select assets by their chunk name
    + **webpackChunkManifest**<br>Global variable exposing the webpack internal module manifest. Webpack needs this manifest injected into the view in production.

*Injecting the webpackChunkManifest*
```twig
{% if webpackChunkManifest is not empty %}
    <script>
    //<![CDATA[
    window.webpackManifest = {{ webpackChunkManifest|raw }}
    //]]>
    </script>
{% endif %}
```

*Injecting javascript files*
```twig
{# Make sure webpack is loaded first #}
{% if webpackAsset('webpack.js') is not empty %}
    <script src="{{ webpackAsset('webpack.js') }}"></script>
{% endif %}
{% for asset in webpackAssets(includePattern='*.js', excludePattern='webpack.js, *async.js') %}
    <script src="{{ asset }}"></script>
{% endfor %}
```
