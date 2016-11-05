<?php

namespace Onyx\Console;

class Application extends \Symfony\Component\Console\Application
{
    private static $logo =
'     __
│   /  \ |\ | \ / \_/
│   \__/ | \|  |  / \
│
└─────────────────── ─ ─ ─ ─ ─ ─

';

    public function getHelp()
    {
        return self::$logo . parent::getHelp();
    }
}
