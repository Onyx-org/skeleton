#------------------------------------------------------------------------------
# Karma
#------------------------------------------------------------------------------

# Spread cli arguments
ifneq (,$(filter $(firstword $(MAKECMDGOALS)),config))
    KARMA_CLI_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
    $(eval $(KARMA_CLI_ARGS):;@:)
endif

ifeq (,$(KARMA_CLI_ARGS))
	KARMA_CLI_ARGS=$(shell grep 'KARMA_ENV=' .env | sed 's/KARMA_ENV=//g')
	ifeq (,$(KARMA_CLI_ARGS))
		KARMA_CLI_ARGS=dev
	endif
endif

config: karma ## Run karma to configure for development environment
	./karma hydrate -e $(KARMA_CLI_ARGS)

karma:
	$(eval LATEST_VERSION := $(shell curl -L -s -H 'Accept: application/json' https://github.com/niktux/karma/releases/latest | sed -e 's/.*"tag_name":"\([^"]*\)".*/\1/'))
	@echo "Latest version of Karma is ${LATEST_VERSION}"
	wget -O karma -q https://github.com/Niktux/karma/releases/download/${LATEST_VERSION}/karma.phar
	chmod 0755 karma

#------------------------------------------------------------------------------

clean-karma:
	-rm -f karma
	-rm -f config/built-in/*.yml

#------------------------------------------------------------------------------

.PHONY: config clean-karma
