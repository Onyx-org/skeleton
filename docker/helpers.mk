WEB_PORT=80

export WEB_PORT
export COMPOSE_PROJECT_NAME=onyx

up:
	docker-compose -f docker/docker-compose.yml up -d

build:
	docker-compose -f docker/docker-compose.yml build

rebuild: build up

down:
	docker-compose -f docker/docker-compose.yml down --volumes

connect:
	docker exec --tty -i onyx-frontend /bin/bash
