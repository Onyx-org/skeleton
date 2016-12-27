ONYX_DIR=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
USER_ID=$(shell id -u)
GROUP_ID=$(shell id -g)

-include vendor/onyx/core/wizards.mk
include qa.mk

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

npm:
	docker run -it --rm \
		-v ${ONYX_DIR}:/usr/src/app \
		-u ${USER_ID}:${GROUP_ID} \
		-w /usr/src/app node:7 \
		npm install

webpack:
	docker run -it --rm \
		-v ${ONYX_DIR}:/usr/src/app \
		-u ${USER_ID}:${GROUP_ID} \
		-w /usr/src/app node:7 \
		node node_modules/.bin/webpack

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
