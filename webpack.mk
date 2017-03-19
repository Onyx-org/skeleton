npm = docker run -it --rm \
		-v ${HOST_SOURCE_PATH}:/usr/src/app \
		-v ${HOME}/.npm:/.npm \
		-u ${USER_ID}:${GROUP_ID} \
		-w /usr/src/app \
		${2} \
		node:7 \
		npm ${1}

npm2 = docker run -it --rm \
		-v ${HOST_SOURCE_PATH}:/usr/src/app \
		-v ${HOME}/.npm:/.npm \
		-u ${USER_ID}:${GROUP_ID} \
		-w /usr/src/app \
		${2} \
		node:7 \
		${1}

bash:
	$(call npm2, bash)

npm-install: npm-cache-dir
	$(call npm, install)

npm-cache-dir:
	mkdir -p ~/.npm

webpack: clean-webpack-built-assets
	$(call npm, run build)

webpack-prod: clean-webpack-built-assets
	$(call npm, run build:prod)

clean-webpack-built-assets:
	rm -rf www/assets

.PHONY: npm webpack webpack-dev webpack-watch clean-webpack-built-assets npm-cache-dir
