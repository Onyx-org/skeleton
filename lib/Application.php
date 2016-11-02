<?php

namespace Onyx;

use Puzzle\Configuration;
use Silex\Provider\ServiceControllerServiceProvider;
use Silex\Provider\RoutingServiceProvider;
use Onyx\Traits;

abstract class Application extends \Silex\Application
{
    use
        Traits\PathManipulation;

    public function __construct(Configuration $configuration, $rootDir)
    {
        parent::__construct();

        $this->loadConfiguration($configuration);
        $this->enableDebug();
        $this->initializePaths($rootDir);

        $this->register(new ServiceControllerServiceProvider());
        $this->registerProviders();
        $this->initializeUrlGeneratorProvider();

        $this->initializeServices();

        $this->mountControllerProviders();
    }

    private function loadConfiguration($configuration)
    {
        $this['configuration'] = $configuration;
    }

    private function initializePaths($rootDir)
    {
        $this['root.path'] = $this->enforceEndingSlash($rootDir);
        $this['documentRoot.path'] = $this['root.path'] . 'www' . DIRECTORY_SEPARATOR;
        $this['var.path'] = $this['root.path'] . $this->removeWrappingSlashes($this['configuration']->readRequired('app/var.path')) . DIRECTORY_SEPARATOR;
    }

    private function enableDebug()
    {
        $this['debug'] = $this['configuration']->read('app/debug', false);
    }

    private function initializeUrlGeneratorProvider()
    {
        $this->register(new RoutingServiceProvider());
    }

    protected function registerProviders()
    {
    }

    protected function initializeServices()
    {
    }

    abstract protected function mountControllerProviders();
}