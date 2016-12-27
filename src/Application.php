<?php

namespace __ONYX_Namespace;

use Puzzle\Configuration;
use Silex\Provider\SessionServiceProvider;
use Onyx\Providers;
use __ONYX_Namespace\Twig\TwigWebpackExtension;
use __ONYX_Namespace\Webpack\WebpackServiceProvider;

class Application extends \Onyx\Application
{
    protected function registerProviders()
    {
        $this->register(new SessionServiceProvider());
        $this->register(new Providers\Twig());
        $this->register(new WebpackServiceProvider());
        /*
        $this->register(new Provider\DBAL());
        $this->register(new Provider\AsseticServiceProvider());
        //*/
    }

    protected function initializeServices()
    {
        $this->configureTwig();
    }

    private function configureTwig()
    {
        $this['twig.path.manager']->addPath(array(
            $this['root.path'] . 'views/',
        ));
        $this['twig']->addExtension(new TwigWebpackExtension($this['webpack_manifest']));
    }

    protected function mountControllerProviders()
    {
        $this->mount('/', new Controllers\Home\Provider());
    }
}
