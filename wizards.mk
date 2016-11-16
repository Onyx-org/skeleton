include .onyx

set-namespace:
	find src/ tests/ www/ -type f -exec sed -i 's/${OLD_NAMESPACE}/$(NAMESPACE)/g' {} \;
	sed -i 's/${OLD_NAMESPACE}/$(NAMESPACE)/g' console
	sed -i 's/${OLD_NAMESPACE}\\\\/$(NAMESPACE)\\\\/g' ./composer.json

controller:
	$(eval CONTROLLER_NAME := $(shell bash -c 'read -p "Enter your controller name : " controllerName; echo $$controllerName'))
	$(eval TARGET_DIR := "src/Controllers/${CONTROLLER_NAME}")
	@cp -rf wizards/controller/* src/Controllers
	@mv src/Controllers/__ONYX_ControllerName ${TARGET_DIR}
	@find ${TARGET_DIR} -type f -exec sed -i 's/__ONYX_ControllerName/${CONTROLLER_NAME}/g' {} \;
	@find ${TARGET_DIR} -type f -exec sed -i 's/__ONYX_Namespace/${NAMESPACE}/g' {} \;
	@echo "Controller created !"
	@echo ""
	@echo "Don't forget to mount your new provider in src/Application.php :"
	@echo ""
	@echo "$$ this->mount('/', new Controllers\\\\${CONTROLLER_NAME}\Provider());"
	@echo ""
