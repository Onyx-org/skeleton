<?php

namespace __ONYX_Namespace\Twig;

use __ONYX_Namespace\Webpack\WebpackManifest;

class TwigWebpackExtension extends \Twig_Extension implements \Twig_Extension_GlobalsInterface
{
    private
        $manifest;

    public function __construct(WebpackManifest $manifest)
    {
        $this->manifest = $manifest;
    }

    public function getGlobals(): array
    {
        return array(
            'webpackChunkManifest' => $this->manifest->getChunkManifest(),
        );
    }

    public function getFunctions(): array
    {
        return [
            new \Twig_SimpleFunction('webpackAssets', [$this, 'webpackAssets']),
            new \Twig_SimpleFunction('webpackAsset', [$this, 'webpackAsset']),
        ];
    }

    /**
     * Outputs list of files from the webpack compilation manifest
     * @param  $string $includePattern A glob expression of files to include
     * @param  $string $excludePattern A glob expression of files to exclude
     * @return Array                   List of file paths
     */
    public function webpackAssets(?string $includePattern = null, ?string $excludePattern = null): array
    {
        $validFiles = $this->manifest->getFiles();

        if (!empty($includePattern))
        {
            $validFiles = $this->filterAssets($includePattern);
        }

        if (!empty($excludePattern))
        {
            $invalidFiles = $this->filterAssets($excludePattern);
            $validFiles = array_diff($validFiles, $invalidFiles);
        }

        return $validFiles;
    }

    private function filterAssets(string $includeGlob): array
    {
        $assets = $this->manifest->getFiles();
        $filteredAssets = [];
        $includePatterns = explode(',', $includeGlob);

        foreach ($includePatterns as $globPattern)
        {
            $filteredAssets += array_filter($assets, function($fileName) use ($globPattern) {
                return fnmatch(trim($globPattern), $fileName, FNM_CASEFOLD);
            }, ARRAY_FILTER_USE_KEY);
        }

        return array_unique($filteredAssets);
    }

    /**
     * Returns the path for a single file
     * @param  string $name Exact name of the file
     * @return string       Path to the file
     */
    public function webpackAsset($name): ?string
    {
        return $this->manifest->getFiles()[$name];
    }
}
