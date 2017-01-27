<?php

namespace __ONYX_Namespace\Webpack;

class WebpackManifest
{
    private
        $files,
        $chunkManifest = '';

    public function __construct(string $manifestPath, string $chunkManifestPath)
    {
        $this->setFiles($manifestPath);
        $this->setChunkManifest($chunkManifestPath);
    }

    public function getFiles(): array
    {
        return $this->files;
    }

    private function setFiles(string $manifestPath): void
    {
        $manifest = json_decode($this->loadManifest($manifestPath), true);

        if (!$manifest)
        {
            throw new \Exception(sprintf('Could not decode %s. Is it valid JSON?', $this->manifestPath));
        }

        if (!is_array($manifest))
        {
            throw new \Exception(sprintf('Expected an array from Webpack manifest %s', $this->manifestPath));
        }

        $this->files = $manifest;
    }

    public function getChunkManifest(): string
    {
        return $this->chunkManifest;
    }

    private function setChunkManifest($chunkManifestPath): void
    {
        if (!is_file($chunkManifestPath))
        {
            return;
        }

        $JSONChunkManifest = file_get_contents($chunkManifestPath);

        if (!$JSONChunkManifest)
        {
            throw new \Exception(sprintf('Could not open file %s', $chunkManifestPath));
        }

        $this->chunkManifest = $JSONChunkManifest;
    }

    private function loadManifest($manifestPath): string
    {
        $JSONManifest = file_get_contents($manifestPath);

        if (!$JSONManifest)
        {
            throw new \Exception(sprintf('The file %s could not be found. Did you forget to run webpack?', $manifestPath));
        }

        return $JSONManifest;
    }
}
