<?php

namespace MyApp;

use Puzzle\Configuration;
use Pimple\Container;
//use Spear\Silex\Provider\Commands\AsseticDumper;

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
    //    $this->app->add(new AsseticDumper($this->configuration, $dic['assetic.dumper'], $dic['assetic.path_to_web']));
    }

    public function run()
    {
        $this->app->run();
    }
}
