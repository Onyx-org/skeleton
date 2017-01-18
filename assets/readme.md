# Gestion des assets

<!-- MarkdownTOC -->

- [Webpack](#webpack)
- [Commandes](#commandes)
- [Exemple](#exemple)
- [Routing](#routing)
    - [registerRoute\(routeName, callback\)](#registerrouteroutename-callback)
        - [Route asynchrone](#route-asynchrone)
- [Controllers](#controllers)
- [Optimisation : Séparation des scripts](#optimisation--séparation-des-scripts)
    - [Entrypoints](#entrypoints)
    - [Chargement asynchrone](#chargement-asynchrone)
- [Comment fonctionne webpack avec l'application ?](#comment-fonctionne-webpack-avec-lapplication-)

<!-- /MarkdownTOC -->

## Webpack

- Packaging des assets utilisés et uniquement eux
- Réécriture automatique des imports en fonction des fichiers publics créés
- Séparation des librairies externes du code de l'application
- Mise en commun du code réutilisable
- Gestion du cache des navigateurs
- Chargement de dépendances asynchrones
- Minification
- Tree Shaking du code JS ES6+
- Génération de sources maps
- Développement en mode *livereload*

*@TODO*:
- Gestion i18n
- Lancement de tests
- Optimisation des images

## Commandes

A éxécuter à la racine du projet :

- **make webpack** : Compile les assets pour la production
- **make webpack-dev** : Compile les assets pour le développement
- **make webpack-watch** : Compile les assets pour le développement, recompile si un fichier est modifié et recharge automatiquement l'application

## Exemple

Avec webpack, pour peu qu'un type de fichier dispose d'un loader adéquat il peut être importé dans le Javascript comme un module.

Les imports cherchent dans les dossiers suivants :
- /assets
- /node_modules

**main.js**
```js
// Polyfills nécessaire au bon fonctionnement de webpack
import 'core-js/es6/promise';
import 'core-js/es6/object';
import 'core-js/es6/function';
// Import de bootstrap depuis node_modules. Le fichier package.json sera lu pour déterminer quoi importer.
import 'bootstrap';
// Fichier référencant tous les styles externes
import 'sass/vendor.scss';
// Css de l'application
import 'sass/main.scss';
// Classe gérant le chargement des controllers
import App from 'App';
// Chargement d'un controlleur
import HomeController from 'Controllers/Home';

let app = new App();

// Laision entre la route home et le controller HomeController
app.registerRoute('home', HomeController);

// Controlleur séparé du bundle principal dans son fichier par require.ensure
app.registerRoute('hello', () => require.ensure([], function(require) {
    return require('Controllers/Hello');
}, 'async'));

document.addEventListener("DOMContentLoaded", () => {
    // Exécution du controller de la route courante
    app.handle(document.getElementsByTagName('html')[0].dataset.route);
});
```

## Routing

Un simple router est mis en place pour charger le controller adéquat pour la page courante. Basé sur l'article [DOM-based Routing](https://www.paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/). C'est un router pour applications basées sur des changements de page avec rafraichissement.

**main.js**
```js
import App from 'App';
import HomeController from 'Controllers/Home';

let app = new App();

app.registerRoute('home', HomeController);

document.addEventListener("DOMContentLoaded", () => {
    // Exécution du controller de la route courante
    app.handle(document.getElementsByTagName('html')[0].dataset.route);
});
```
Le router se base sur un attribut data placé sur la balise `html` qui renseigne le nom de la route tel que le backend l'a déclaré.

### registerRoute(routeName, callback)
- **routeName** : Le nom de la route tel que le backend l'a déclaré
- **callback** : Un constructeur (class|function) ou une fonction qui renvoie une `Promise` pour un constructeur (asynchrone)

#### Route asynchrone

Vous pouvez déclarer un controller de manière asynchrone avec `require.ensure`.
Préfixez le nom du fichier généré par **async** pour qu'il soit automatiquement ignoré lors de l'injection dans le html.

```js
app.registerRoute('hello', () => require.ensure([], function(require) {
    return require('Controllers/Hello');
}, 'async'));
```

## Controllers

L'application permet la création d'un `Controller` par `Route`. Un controller est une fonction ou une classe.

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
    // jQuery est disponible de façon globale
    $('html').text('Hello');
}
```

## Optimisation : Séparation des scripts

Webpack package tous les scripts en un seul fichier. Cela peut potentiellement ralentir le premier chargement en incluant trop de fichiers qui ne sont pas immédiatement utiles. Pour se faire nous pouvons séparer notre applications en plusieurs fichiers.

### Entrypoints

Webpack génère un fichier par entrypoint déclaré. Si vous souhaitez créer un nouveau fichier pour une page différente plus tôt que d'utiliser un entrypoint commun vous pouvez ajouter le vôtre.

Dans cet exemple 2 entrypoints sont créés. Un pour la partie public du site et l'autre pour la partie administrative.

**webpack.common.js**
```js
...
entry: {
    main: './assets/main',
    admin: './assets/admin'
},
...
```

Webpack essaie de mettre en commun le code entre les différents entrypoints en extrayant les modules commun. Mettez à jour la configuration pour que le nouveau entrypoint soit pris en compte.

**webpack.prod.js**
```js
plugins: [
        ...
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            chunks: ['main', 'admin'], // Mettez à jour cette ligne avec votre entrypoint
            minChunks: 2
        }),
        ...
    ]
```

Si votre entrypoint utilise beaucoup de dépendances externes il peut être intéressant de séparer ces dépendances du fichier que webpack génère pour avoir une meilleure gestion du cache.

```js
plugins: [
        ...
        // Doit être ajouté après des chunk common ou vendor*
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor.admin',
            chunks: ['admin'],
            minChunks: module => /node_modules\//.test(module.resource)
        }),
        ...
    ]
```

*L'ordre de la création des `CommonsChunkPlugin` est important. Si un module a déjà été extrait par un appel `CommonsChunkPlugin` il ne pourra plus l'être par un suivant (à moins qu'il ne soit configuré pour extraire depuis un chunk `CommonsChunkPlugin` préalablement généré).

### Chargement asynchrone

Vous n'êtes pas obligé de créer de nouveaux entrypoints à chaque fois que vous jugez qu'une partie de votre code est trop lourde pour être chargée dès le premier appel.

Webpack permet de séparer une dépendance pour la charger en asynchrone directement depuis votre code.

**[require.ensure(dependencies: String[], callback: function(require), chunkName: String)](https://webpack.js.org/guides/code-splitting-require/#require-ensure-)**

```js
// Le module b sera séparé dans son propre fichier
require.ensure([], function(require){
    require('b');
});

// Le module b sera séparé dans son fichier (chunk) mon-super-fichier-async
require.ensure([], function(require){
    require('b');
}, 'mon-super-fichier-async');

// require.ensure renvoie un objet Promise
require.ensure([], function(require){
    return require('google-maps');
}, 'maps-async').then(function(GoogleMapsLoader) {
    GoogleMapsLoader.load(function(google) {
        new google.maps.Map(el, options);
    });
});

// ou
require.ensure([], function(require){
    var GoogleMapsLoader = require('google-maps');
    GoogleMapsLoader.load(function(google) {
        new google.maps.Map(el, options);
    });
}, 'maps-async');
```

Si vous utilisez `require.ensure` assurez vous que le fichier js généré n'est pas inclus vos vues et laissez webpack s'occuper de le charger quand il en a besoin.
```twig
{% for asset in webpackAssets(include='*.js', exclude='my-async-file') %}
    <script src="{{ asset }}"></script>
{% endfor %}
```

**Le projet est configuré pour exclure tout fichier nommé async ou terminant par async**. Nommez votre fichier **async** ou **nom.async** et il ne sera pas ajouté dans le html.
```
{% for asset in webpackAssets(include='*.js', exclude='webpack.js, *async.js') %}
    <script src="{{ asset }}"></script>
{% endfor %}
```

## Comment fonctionne webpack avec l'application ?

Webpack génère un manifeste de tous les fichiers qu'il a généré lors de la compilation. Ce fichier est lu par l'application et est utilisé pour insèrer les différents fichiers dans le layout principal.

- [WebpackManifest](../src/Webpack/WebpackManifest.php) : Expose le service `webpack_manifest` permettant de parcourir les assets générés par webpack
- [TwigWebpackExtension](../src/Twig/TwigWebpackExtension.php) : Expose des variables et fonctions permettant aux vues twig d'utiliser les assets :
    + **webpackAssets(include, exclude)**<br>Fonction twig permettant de sélectionner des assets à partir de sélecteurs glob.
    + **webpackAsset(name)**<br>Fonction twig permettant de sélectionner un asset par son nom (chunkname)
    + **webpackChunkManifest**<br>Variable globale donnée à twig contenant un manifeste des modules gérés par Webpack. Webpack en a besoin pour son utilisation en production.

*Utilisation du webpackChunkManifest*
```twig
{% if webpackChunkManifest is not empty %}
    <script>
    //<![CDATA[
    window.webpackManifest = {{ webpackChunkManifest|raw }}
    //]]>
    </script>
{% endif %}
```

*Chargement des fichiers javascripts*
```twig
{# Make sure webpack is loaded first #}
{% if webpackAsset('webpack.js') is not empty %}
    <script src="{{ webpackAsset('webpack.js') }}"></script>
{% endif %}
{% for asset in webpackAssets(include='*.js', exclude='webpack.js, *async.js') %}
    <script src="{{ asset }}"></script>
{% endfor %}
```
