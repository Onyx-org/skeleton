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

    private function setChunkManifest(string $chunkManifestPath): void
    {
        if (!is_file($chunkManifestPath))
        {
            return;
        }

        $this->chunkManifest = $this->getFileContent($chunkManifestPath);
    }

    private function loadManifest(string $manifestPath): string
    {
        if (!is_file($manifestPath))
        {
            throw new \Exception(sprintf('The file %s could not be found. Did you forget to run webpack?', $manifestPath));
        }

        return $this->getFileContent($manifestPath);
    }

    private function getFileContent(string $path): string
    {
        $JSONManifest = file_get_contents($path);

        if ($JSONManifest === false)
        {
            throw new \Exception(sprintf('Something went wrong while trying to read the file %s', $path));
        }

        return $JSONManifest;
    }
}
