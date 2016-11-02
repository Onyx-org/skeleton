<?php

namespace Onyx\Traits;

use Symfony\Component\HttpFoundation\Session\Session;

trait SessionAware
{
    private
        $session;

    public function setSession(Session $session)
    {
        $this->session = $session;

        return $this;
    }

    private function addSuccessFlash($message)
    {
        return $this->addFlash($message, 'success');
    }

    private function addInfoFlash($message)
    {
        return $this->addFlash($message, 'info');
    }

    private function addWarningFlash($message)
    {
        return $this->addFlash($message, 'warning');
    }

    private function addErrorFlash($message)
    {
        return $this->addFlash($message, 'error');
    }

    private function addResultFlash($result, $successMessage, $errorMessage)
    {
        if($result)
        {
            return $this->addSuccessFlash($successMessage);
        }

        return $this->addErrorFlash($errorMessage);
    }

    private function addFlash($message, $type = 'info')
    {
        return $this->session->getFlashBag()->add($type, $message);
    }
}
