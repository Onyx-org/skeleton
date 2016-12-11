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

        $this->app->add(new Console\HelloWorld());
    }

    public function run(): void
    {
        $this->app->run();
    }
}
