WEB_PORT=80
ONYX_DIR=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
USER_ID=$(shell id -u)
GROUP_ID=$(shell id -g)
DEV_SERVER_PORT=$(shell echo $(WEB_PORT)+1000 | bc)

export WEB_PORT
export DEV_SERVER_PORT
export USER_ID
export GROUP_ID

-include vendor/onyx/core/wizards.mk
include qa.mk
include docker.mk
include npm.mk

all: install phpunit

install: var install-deps config webpack

var:
	mkdir -m a+w var

config: karma
	./karma hydrate

karma:
	$(eval LATEST_VERSION := $(shell curl -L -s -H 'Accept: application/json' https://github.com/niktux/karma/releases/latest | sed -e 's/.*"tag_name":"\([^"]*\)".*/\1/'))
	@echo "Latest version of Karma is ${LATEST_VERSION}"
	wget -O karma -q https://github.com/Niktux/karma/releases/download/${LATEST_VERSION}/karma.phar
	chmod 0755 karma

install-deps: install-back-deps install-front-deps

install-back-deps: composer.phar
	php composer.phar install --ignore-platform-reqs

update-back-deps: composer.phar
	php composer.phar update

composer.phar:
	curl -sS https://getcomposer.org/installer | php

dumpautoload: composer.phar
	php composer.phar dumpautoload

phpunit: vendor/bin/phpunit
	vendor/bin/phpunit

vendor/bin/phpunit: install-deps

install-front-deps: npm

uninstall: clean remove-deps
	rm -rf www/assets
	rm -f composer.lock
	rm -f config/built-in/*.yml

clean:
	rm -f karma
	rm -f composer.phar

remove-deps:
	rm -rf vendor
	rm -rf node_modules

.PHONY: install config install-deps install-back-deps install-front-deps update-deps phpunit clean remove-deps uninstall dumpautoload
