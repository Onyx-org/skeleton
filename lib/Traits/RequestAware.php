<?php

namespace Onyx\Traits;

use Symfony\Component\HttpFoundation\RequestStack;

trait RequestAware
{
    private
        $request,
        $requestStack;

    public function setRequest(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
        $this->request = $requestStack->getCurrentRequest();

        return $this;
    }
}
