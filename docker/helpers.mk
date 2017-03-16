WEB_PORT=80

export WEB_PORT
export COMPOSE_PROJECT_NAME=onyx

up: prepare-bash-history-directory
	docker-compose -f docker/docker-compose.yml up -d

build:
	docker-compose -f docker/docker-compose.yml build

rebuild: build up

down:
	docker-compose -f docker/docker-compose.yml down --volumes

connect:
	docker exec --tty -i onyx-frontend /bin/bash


prepare-bash-history-directory:
	$(shell [ ! -d system/bash-history ] && mkdir -p system/bash-history)
	touch system/bash-history/.frontend
