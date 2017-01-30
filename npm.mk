npm = docker run -it --rm \
		-v ${ONYX_DIR}:/usr/src/app \
		-u ${USER_ID}:${GROUP_ID} \
		-w /usr/src/app \
		${2} \
		node:7 \
		npm ${1}

npm:
	$(call npm, install)

webpack:
	rm -f www/assets/*
	$(call npm, run build)

webpack-dev:
	rm -f www/assets/*
	$(call npm, run build:dev)

webpack-watch:
	$(call npm, run watch, -e "DEV_SERVER_PORT=${DEV_SERVER_PORT}" -p "${DEV_SERVER_PORT}:${DEV_SERVER_PORT}")

.PHONY: npm webpack webpack-dev webpack-watch
