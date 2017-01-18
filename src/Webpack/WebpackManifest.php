<?php

namespace __ONYX_Namespace\Webpack;

class WebpackManifest
{
    public $files;
    public $chunkManifest;

    public function __construct($manifestPath, $chunkManifestPath)
    {
        if (!file_exists($manifestPath)) {
            throw new \Exception(sprintf('The file %s could not be found. Did you forget to run webpack?', $manifestPath), 1);
        }

        $this->files = json_decode(file_get_contents($manifestPath), true);

        if (file_exists($chunkManifestPath)) {
            $this->chunkManifest = json_decode(file_get_contents($chunkManifestPath), true);
        }
    }
}
