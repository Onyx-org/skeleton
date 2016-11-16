<?php

namespace __ONYX_Namespace\Console;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class HelloWorld extends Command
{
    protected function configure()
    {
        $this->setName('hello')
            ->setDescription('Say hello world');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln('Hello world !');
    }
}
