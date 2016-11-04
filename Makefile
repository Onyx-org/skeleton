all: composer config

config: karma
	karma hydrate
	
karma:
	wget https://github.com/Niktux/karma/releases/download/5.5.0/karma.phar
	chmod 0755 karma.phar
	mv karma.phar karma
	
composer: composer.phar
	php composer.phar install
	
composer.phar:
	 curl -sS https://getcomposer.org/installer | php
