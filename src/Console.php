<?php

namespace __ONYX_Namespace;

use Puzzle\Configuration;
use Pimple\Container;

class Console
{
    private
        $app,
        $configuration;

    public function __construct(Container $container)
    {
        $this->configuration = $container['configuration'];

        $this->app = new \Onyx\Console\Application();

        $this->registerRouteLister($container);

        $this->app->add(new Console\HelloWorld());
    }

    public function run(): void
    {
        $this->app->run();
    }

    private function registerRouteLister(Container $container)
    {
        $this->app->add(new \Onyx\Console\Commands\RouteLister(new class($container) implements \Onyx\Console\Commands\Routes\Retriever{
                private
                    $app;

                public function __construct(Container $app)
                {
                    $this->app = $app;
                }

                public function retrieveRoutes(): iterable
                {
                    $this->app->flush();

                    return $this->app['routes'];
                }
            }
        ));
    }
}
