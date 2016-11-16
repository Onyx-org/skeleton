<?php

namespace __ONYX_Namespace\Controllers\__ONYX_ControllerName;

use Silex\Application;
use Silex\Api\ControllerProviderInterface;

class Provider implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        $app['controller.__ONYX_ControllerName'] = function() use($app) {
            $controller = new Controller();
            $controller
                ->setRequest($app['request_stack'])
                ->setTwig($app['twig']);

            return $controller;
        };

        $controllers = $app['controllers_factory'];

        $controllers
            ->match('/', 'controller.__ONYX_ControllerName:homeAction')
            ->method('GET')
            ->bind('__ONYX_ControllerName.home');

        return $controllers;
    }
}
