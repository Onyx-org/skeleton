<?php

namespace Onyx\Providers;

use Pimple\ServiceProviderInterface;
use Puzzle\Configuration;
use Pimple\Container;
use Silex\Provider\TwigServiceProvider;

class Twig implements ServiceProviderInterface
{
    private
        $container;

    public function register(Container $container)
    {
        $this->container = $container;
        $this->validatePuzzleConfiguration($container);
        $this->initializeTwigProvider($container);
    }

    public function addPath($paths, $prioritary = true)
    {
        if(! is_array($paths))
        {
            $paths = array($paths);
        }

        $twigPath = $this->retrieveExistingTwigPath();

        $arrayAddFunction = 'array_push';
        if($prioritary === true)
        {
            $arrayAddFunction = 'array_unshift';
            $paths = array_reverse($paths);
        }

        $this->container['twig.path'] = function() use($twigPath, $paths, $arrayAddFunction) {
            foreach ($paths as $path)
            {
                $arrayAddFunction($twigPath, $path);
            }

            return $twigPath;
        };
    }

    private function initializeTwigProvider(Container $container)
    {
        $container->register(new TwigServiceProvider());

        $container['twig.cache.path'] = $container['var.path'] . $container['configuration']->read('twig/cache/directory', false);

        $container['twig.options'] = array(
            'cache' => $container['twig.cache.path'],
            'auto_reload' => $container['configuration']->read('twig/developmentMode', false),
        );

        $container['twig.path.manager'] = function ($c) {
            return $this;
        };
    }

    private function retrieveExistingTwigPath()
    {
        $path = array();

        if(isset($this->container['twig.path']))
        {
            $path = $this->container['twig.path'];

            if($path instanceof \Closure)
            {
                $path = $path();
            }
        }

        return $path;
    }

    private function validatePuzzleConfiguration(Container $container)
    {
        if(! isset($container['configuration']) || ! $container['configuration'] instanceof Configuration)
        {
            throw new \LogicException(__CLASS__ . ' requires an instance of Puzzle\Configuration (as key "configuration").');
        }
    }
}
