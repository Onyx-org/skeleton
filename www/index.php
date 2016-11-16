<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Puzzle\Configuration\Yaml;
use Puzzle\Configuration\Stacked;
use Gaufrette\Filesystem;
use Gaufrette\Adapter\Local;
use __ONYX_Namespace\Application;

$defaultConfigurationFileStorage= new Filesystem(new Local(__DIR__ . '/../config/built-in'));
$defaultConfiguration = new Yaml($defaultConfigurationFileStorage);

$localConfigurationFileStorage= new Filesystem(new Local(__DIR__ . '/../config/local'));
$localConfiguration = new Yaml($localConfigurationFileStorage);

$configuration = new Stacked();
$configuration
    ->overrideBy($defaultConfiguration)
    ->overrideBy($localConfiguration);

$rootDir = realpath(__DIR__ . '/..');

$app = new Application($configuration, $rootDir);
$app->run();