<?php

namespace __ONYX_Namespace\Twig;

use __ONYX_Namespace\Webpack\WebpackManifest;

class TwigWebpackExtension extends \Twig_Extension implements \Twig_Extension_GlobalsInterface
{
    public function __construct(WebpackManifest $manifest)
    {
        $this->manifest = $manifest;
    }

    public function getGlobals()
    {
        return array(
            'webpackChunkManifest' => $this->manifest->getChunkManifest(),
        );
    }

    public function getFunctions()
    {
        return [
            new \Twig_SimpleFunction('webpackAssets', [$this, 'webpackAssets']),
            new \Twig_SimpleFunction('webpackAsset', [$this, 'webpackAsset']),
        ];
    }

    /**
     * Outputs list of files from the webpack compilation manifest
     * @param  $string $include A glob expression of files to include
     * @param  $string $include A glob expression of files to exclude
     * @return Array            List of file paths
     */
    public function webpackAssets($include = null, $exclude = null)
    {
        $validFiles = $this->manifest->getFiles();

        if (!empty($include)) {
            $validFiles = [];
            $includePatterns = explode(',', $include);
            foreach ($includePatterns as $pattern) {
                $validFiles += array_filter($this->manifest->getFiles(), function($fileName) use ($pattern) {
                    return fnmatch(trim($pattern), $fileName, FNM_CASEFOLD);
                }, ARRAY_FILTER_USE_KEY);
            }
        }

        if (!empty($exclude)) {
            $excludePatterns = explode(',', $exclude);
            foreach ($excludePatterns as $pattern) {
                $validFiles = array_filter($validFiles, function($fileName) use ($pattern) {
                    return !fnmatch(trim($pattern), $fileName);
                }, ARRAY_FILTER_USE_KEY);
            }
        }

        return $validFiles;
    }

    /**
     * Returns the path for a single file
     * @param  string $name Exact name of the file
     * @return string       Path to the file
     */
    public function webpackAsset($name)
    {
        return $this->manifest->getFiles()[$name];
    }
}
