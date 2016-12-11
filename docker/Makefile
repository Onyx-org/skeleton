WEB_PORT=80

export WEB_PORT
export USER_ID=$(id -u)
export GROUP_ID=$(id -g)

up:
	docker-compose up -d

build:
	docker-compose build

rebuild: build up

down:
	docker-compose down

connect:
	docker exec --tty -i onyx-frontend /bin/bash
