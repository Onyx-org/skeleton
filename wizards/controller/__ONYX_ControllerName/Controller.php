<?php

namespace __ONYX_Namespace\Controllers\__ONYX_ControllerName;

use Onyx\Traits;
use Symfony\Component\HttpFoundation\Response;
use Psr\Log\LoggerAwareTrait;
use Psr\Log\NullLogger;

class Controller
{
    use
        Traits\RequestAware,
        Traits\TwigAware,
        LoggerAwareTrait;

    public function __construct()
    {
        $this->logger = new NullLogger();
    }

    public function homeAction()
    {
        return $this->render('home.twig');
    }
}
