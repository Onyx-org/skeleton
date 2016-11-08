ONYX_DIR=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
USER_ID=$(shell id -u)
GROUP_ID=$(shell id -g)

all: install phpunit

install: install-deps config

config: karma
	./karma hydrate

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

packaging-build:
	docker build --build-arg UID=${USER_ID} -t onyx/packaging docker/images/packaging/

bower: packaging-build
	docker run -t -i --rm -v ${ONYX_DIR}:/home/bower -u ${USER_ID}:${GROUP_ID} onyx/packaging bower --config.interactive=false install

.PHONY: install config install-deps update-deps phpunit bower packaging-build

