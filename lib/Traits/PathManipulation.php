<?php

namespace Onyx\Traits;

trait PathManipulation
{
    private function enforceLeadingSlash($path)
    {
        return DIRECTORY_SEPARATOR . $this->removeLeadingSlash($path);
    }

    private function removeLeadingSlash($path)
    {
        return ltrim($path, DIRECTORY_SEPARATOR);
    }

    private function enforceEndingSlash($path)
    {
        return $this->removeEndingSlash($path) . DIRECTORY_SEPARATOR;
    }

    private function removeEndingSlash($path)
    {
        return rtrim($path, DIRECTORY_SEPARATOR);
    }

    private function removeWrappingSlashes($path)
    {
        return trim($path, DIRECTORY_SEPARATOR);
    }
}
