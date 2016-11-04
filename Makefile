all: install phpunit

install: install-deps config

config: karma
	karma hydrate
	
karma:
	wget https://github.com/Niktux/karma/releases/download/5.5.0/karma.phar
	chmod 0755 karma.phar
	mv karma.phar karma
	
install-deps: composer.phar
	php composer.phar install
	
update-deps: composer.phar
	php composer.phar update
	
composer.phar:
	 curl -sS https://getcomposer.org/installer | php

phpunit: vendor/bin/phpunit
	vendor/bin/phpunit

vendor/bin/phpunit: install-deps
