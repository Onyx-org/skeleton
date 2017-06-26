###############################################################################
# ONYX Main Makefile
###############################################################################

HOST_SOURCE_PATH=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

USER_ID=$(shell id -u)
GROUP_ID=$(shell id -g)

export USER_ID
export GROUP_ID

#------------------------------------------------------------------------------

-include vendor/onyx/core/wizards.mk
include makefiles/composer.mk
-include makefiles/console.mk
include makefiles/docker.mk
include makefiles/karma.mk
include makefiles/phpunit.mk
include makefiles/qa.mk
include makefiles/webpack.mk
include makefiles/whalephant.mk

#------------------------------------------------------------------------------

.DEFAULT_GOAL := help

init: var install-dependencies config webpack gitignore .env ## Initialize project

.env:
	cp .env.example .env

var:
	mkdir -m a+w var

install-dependencies: composer-install npm-install

gitignore:
	sed '/^composer.lock$$/d' -i .gitignore

help:
	@echo "========================================"
	@echo "ONYX Makefile"
	@echo "========================================"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo "========================================"

#------------------------------------------------------------------------------

clean: clean-composer clean-docker clean-karma clean-phpunit clean-qa clean-webpack clean-whalephant
	-rm -rf var

#------------------------------------------------------------------------------

.PHONY: init install-dependencies gitignore help clean
