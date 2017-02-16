###############################################################################
# ONYX Main Makefile
###############################################################################

ONYX_DIR=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

USER_ID=$(shell id -u)
GROUP_ID=$(shell id -g)

export USER_ID
export GROUP_ID

# Spread cli arguments for composer & phpunit
ifneq (,$(filter $(firstword $(MAKECMDGOALS)),composer phpunit))
    CLI_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
    $(eval $(CLI_ARGS):;@:)
endif

# Add ignore platform reqs for composer install & update
COMPOSER_ARGS=
ifeq (composer, $(firstword $(MAKECMDGOALS)))
    ifneq (,$(filter install update,$(CLI_ARGS)))
        COMPOSER_ARGS=--ignore-platform-reqs
    endif
endif

#------------------------------------------------------------------------------
# Default target
#------------------------------------------------------------------------------
init: var install-deps config gulp gitignore

#------------------------------------------------------------------------------
# Includes
#------------------------------------------------------------------------------
-include vendor/onyx/core/wizards.mk
-include docker/helpers.mk
include qa.mk

#------------------------------------------------------------------------------
# High level targets
#------------------------------------------------------------------------------
install-deps: composer-install bower

var:
	mkdir -m a+w var

.PHONY: install install-deps config composer composer-install composer-dumpautoload phpunit bower create-bower-image clean-bower-image gulp create-gulp-image clean-gulp-image uninstall clean remove-deps

#------------------------------------------------------------------------------
# Karma
#------------------------------------------------------------------------------
config: karma
	./karma hydrate

karma:
	$(eval LATEST_VERSION := $(shell curl -L -s -H 'Accept: application/json' https://github.com/niktux/karma/releases/latest | sed -e 's/.*"tag_name":"\([^"]*\)".*/\1/'))
	@echo "Latest version of Karma is ${LATEST_VERSION}"
	wget -O karma -q https://github.com/Niktux/karma/releases/download/${LATEST_VERSION}/karma.phar
	chmod 0755 karma

#------------------------------------------------------------------------------
# Composer
#------------------------------------------------------------------------------
composer: composer.phar
	php composer.phar $(CLI_ARGS) $(COMPOSER_ARGS)

composer.phar:
	curl -sS https://getcomposer.org/installer | php

composer-install:
	php composer.phar install --ignore-platform-reqs

composer-dumpautoload: composer.phar
	php composer.phar dumpautoload

#------------------------------------------------------------------------------
# PHPUnit
#------------------------------------------------------------------------------
phpunit: vendor/bin/phpunit
	docker run -it --rm --name phpunit -v ${ONYX_DIR}:/usr/src/onyx -w /usr/src/onyx php:7.1-cli vendor/bin/phpunit $(CLI_ARGS)

vendor/bin/phpunit: composer-install

#------------------------------------------------------------------------------
# Bower
#------------------------------------------------------------------------------
create-bower-image:
	docker build -q --build-arg UID=${USER_ID} -t onyx/bower docker/images/packaging/bower/

clean-bower-image:
	docker rmi onyx/bower

bower: create-bower-image
	docker run -t -i --rm \
	           -v ${ONYX_DIR}:/home/bower \
	           -u ${USER_ID}:${GROUP_ID} \
	           onyx/bower bower --config.interactive=false install

#------------------------------------------------------------------------------
# Gulp
#------------------------------------------------------------------------------
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
	$(call gulp, minify)
	$(call gulp, publish)

#------------------------------------------------------------------------------
# Cleaning targets
#------------------------------------------------------------------------------
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
	rm -rf bower_components

gitignore:
	sed '/^composer.lock #.*$$/d' -i .gitignore
