<?php

namespace __ONYX_Namespace\Webpack;

class WebpackManifest
{
    public $files;

    public function __construct($manifestPath)
    {
        if (!file_exists($manifestPath)) {
            throw new \Exception(sprintf('The file %s could not be found. Did you forget to run webpack?', $manifestPath), 1);
        }

        $this->files = json_decode(file_get_contents($manifestPath), true);
    }
}
