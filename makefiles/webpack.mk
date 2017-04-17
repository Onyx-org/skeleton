#------------------------------------------------------------------------------
# Webpack
#------------------------------------------------------------------------------

npm = docker run -it --rm \
		-v ${HOST_SOURCE_PATH}:/usr/src/app \
		-v ${HOME}/.npm:/.npm \
		-u ${USER_ID}:${GROUP_ID} \
		-w /usr/src/app \
		${2} \
		node:7 \
		npm ${1}

#------------------------------------------------------------------------------

npm-install: npm-cache-dir
	$(call npm, install)

npm-cache-dir:
	mkdir -p ~/.npm

webpack: clean-webpack-assets ## Run webpack
	$(call npm, run build)

webpack-prod: clean-webpack-assets ## Run webpack for production
	$(call npm, run build:prod)

#------------------------------------------------------------------------------

clean-webpack: clean-webpack-assets
	-rm -rf node_modules

clean-webpack-assets:
	-rm -rf www/assets

#------------------------------------------------------------------------------

.PHONY: npm-install npm-cache-dir webpack webpack-prod clean-webpack clean-webpack-assets
