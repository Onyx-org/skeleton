#------------------------------------------------------------------------------
# Docker
#------------------------------------------------------------------------------

DOCKER_COMPOSE_YML?=docker/docker-compose.yml

#------------------------------------------------------------------------------

up: prepare-bash-history-directory ## Create environment
	docker-compose -f ${DOCKER_COMPOSE_YML} up -d

build:
	docker-compose -f ${DOCKER_COMPOSE_YML} build

rebuild: build up

down: ## Dispose environment
	docker-compose -f ${DOCKER_COMPOSE_YML} down --volumes

connect:
	docker-compose -f ${DOCKER_COMPOSE_YML} exec frontend /bin/bash

prepare-bash-history-directory:
	$(shell [ ! -d system/bash-history ] && mkdir -p system/bash-history)
	touch system/bash-history/.frontend

#------------------------------------------------------------------------------

clean-docker: down
	-rm -rf system
	-docker rmi onyx/frontend

#------------------------------------------------------------------------------

.PHONY: up build rebuild down connect remove-containers prepare-bash-history-directory clean-docker 
