#------------------------------------------------------------------------------
# Onyx Console
#------------------------------------------------------------------------------

CONSOLE_IMAGE_NAME=onyx/console
CONTAINER_SOURCE_PATH=/usr/src/onyx

console = docker run -t -i --rm \
                -v ${HOST_SOURCE_PATH}:${CONTAINER_SOURCE_PATH} \
                -u ${USER_ID}:${GROUP_ID} \
                -w ${CONTAINER_SOURCE_PATH} \
                ${CONSOLE_IMAGE_NAME} \
                ./console $1

# Spread cli arguments
ifneq (,$(filter $(firstword $(MAKECMDGOALS)),console))
    CLI_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
    ESCAPED_CLI_ARGS = $(subst :,,${CLI_ARGS})
    $(eval $(ESCAPED_CLI_ARGS):;@:)
endif

#------------------------------------------------------------------------------

console-create-image: docker/images/console/Dockerfile
	docker build -q --build-arg UID=${USER_ID} -t ${CONSOLE_IMAGE_NAME} docker/images/console/

console: console-create-image ## Run console command
	$(call console, ${CLI_ARGS})

#------------------------------------------------------------------------------

console-clean:
	-docker rmi ${CONSOLE_IMAGE_NAME}

#------------------------------------------------------------------------------

.PHONY: console-create-image console console-clean
