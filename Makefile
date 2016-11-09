ONYX_DIR=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
USER_ID=$(shell id -u)
GROUP_ID=$(shell id -g)

all: install phpunit

install: install-deps config gulp

config: karma
	./karma hydrate

karma:
	$(eval LATEST_VERSION := $(shell curl -L -s -H 'Accept: application/json' https://github.com/niktux/karma/releases/latest | sed -e 's/.*"tag_name":"\(.*\)".*/\1/'))
	@echo "Latest version of Karma is ${LATEST_VERSION}"
	wget -q https://github.com/Niktux/karma/releases/download/${LATEST_VERSION}/karma.phar
	chmod 0755 karma.phar
	mv karma.phar karma

install-deps: install-back-deps install-front-deps

install-back-deps: composer.phar
	php composer.phar install

update-back-deps: composer.phar
	php composer.phar update

composer.phar:
	 curl -sS https://getcomposer.org/installer | php

phpunit: vendor/bin/phpunit
	vendor/bin/phpunit

vendor/bin/phpunit: install-deps

install-front-deps: bower

create-bower-image:
	docker build -q --build-arg UID=${USER_ID} -t onyx/bower docker/images/packaging/bower/

clean-bower-image:
	docker rmi onyx/bower

bower: create-bower-image
	docker run -t -i --rm \
	           -v ${ONYX_DIR}:/home/bower \
	           -u ${USER_ID}:${GROUP_ID} \
	           onyx/bower bower --config.interactive=false install

create-gulp-image:
	docker build -q --build-arg UID=${USER_ID} -t onyx/gulp docker/images/packaging/gulp/

clean-gulp-image:
	docker rmi onyx/gulp

gulp = docker run -t -i --rm \
	              -v ${ONYX_DIR}/gulpfile.js:/home/gulp/gulpfile.js \
	              -v ${ONYX_DIR}:/home/gulp/project \
	              -u ${USER_ID}:${GROUP_ID} \
	              onyx/gulp gulp $1

gulp: create-gulp-image
	$(call gulp, sass)
	$(call gulp, publish)

uninstall: clean remove-deps
	rm -rf www/assets
	rm -f composer.lock
	rm -f config/built-in/*.yml

clean:
	rm -f karma
	rm -f composer.phar
	-docker rmi onyx/bower onyx/gulp

remove-deps:
	rm -rf vendor
	rm -rf vendor-front

.PHONY: install config install-deps install-back-deps install-front-deps update-deps phpunit bower create-bower-image gulp create-gulp-image clean clean-bower-image clean-gulp-image remove-deps uninstall
