<?php

namespace __ONYX_Namespace;

use Puzzle\Configuration;
use Silex\Provider\SessionServiceProvider;
use Onyx\Providers;

class Application extends \Onyx\Application
{
    protected function registerProviders()
    {
        $this->register(new SessionServiceProvider());
        $this->register(new Providers\Twig());
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
    }

    protected function mountControllerProviders()
    {
        $this->mount('/', new Controllers\Home\Provider());
    }
}
