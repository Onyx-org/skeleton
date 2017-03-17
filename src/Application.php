<?php

namespace __ONYX_Namespace;

use Silex\Provider\SessionServiceProvider;
use Onyx\Providers;

class Application extends \Onyx\Application
{
    protected function registerProviders(): void
    {
        $this->register(new SessionServiceProvider());
        $this->register(new Providers\Monolog([
            // insert your loggers here
        ]));
        $this->register(new Providers\Twig());
        $this->register(new Providers\Webpack());

        // Uncomment this line if you're using a RDBMS
        // $this->register(new Providers\DBAL());
    }

    protected function initializeServices(): void
    {
        $this->configureTwig();
    }

    private function configureTwig(): void
    {
        $this['view.manager']->addPath(array(
            $this['root.path'] . 'views/',
        ));
    }

    protected function mountControllerProviders(): void
    {
        $this->mount('/', new Controllers\Home\Provider());
    }
}
