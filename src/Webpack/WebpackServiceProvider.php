<?php

namespace __ONYX_Namespace\Webpack;

use Pimple\Container;
use Pimple\ServiceProviderInterface;
use __ONYX_Namespace\Webpack\WebpackManifest;

class WebpackServiceProvider implements ServiceProviderInterface
{
    public function register(Container $container)
    {
        $container['webpack_manifest_path'] = getcwd() . '/assets/webpack-manifest.json';
        $container['webpack_chunk_manifest_path'] = getcwd() . '/assets/chunk-manifest.json';
        $container['webpack_manifest'] = function($c) {
            return new WebpackManifest($c['webpack_manifest_path'], $c['webpack_chunk_manifest_path']);
        };
    }
}
