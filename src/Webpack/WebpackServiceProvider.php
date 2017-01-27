<?php

namespace __ONYX_Namespace\Webpack;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use __ONYX_Namespace\Webpack\WebpackManifest;

class WebpackServiceProvider implements ServiceProviderInterface
{
    public function register(Container $container)
    {
        $container['webpack.manifest.path'] = getcwd() . '/assets/webpack-manifest.json';
        $container['webpack.chunk.manifest.path'] = getcwd() . '/assets/chunk-manifest.json';
        $container['webpack.manifest'] = function($c) {
            return new WebpackManifest($c['webpack.manifest.path'], $c['webpack.chunk.manifest.path']);
        };
    }
}
