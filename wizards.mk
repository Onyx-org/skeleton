include .onyx

.PHONY: wizard-set-namespace wizard-new-controller

.onyx:
	$(error .onyx file is missing)

wizard-set-namespace:
	$(eval NEW_NAMESPACE := $(shell bash -c 'read -p "Enter your application namespace : " namespace; echo $$namespace'))
	find src/ tests/ www/ -type f -exec sed -i 's/${NAMESPACE}/$(NEW_NAMESPACE)/g' {} \;
	sed -i 's/${NAMESPACE}/$(NEW_NAMESPACE)/g' console
	sed -i 's/${NAMESPACE}\\\\/$(NEW_NAMESPACE)\\\\/g' ./composer.json
	sed -i 's/^NAMESPACE=.*$$/NAMESPACE=$(NEW_NAMESPACE)/' ./.onyx
	@echo "Namespace updated !"
	@echo ""

wizard-new-controller: .onyx
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
