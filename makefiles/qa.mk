#------------------------------------------------------------------------------
# Quality Assurance
#------------------------------------------------------------------------------

COMMA=,
QA_IMAGE_NAME=onyx/qa

qa = docker run -t -i --rm \
                -v ${HOST_SOURCE_PATH}:/var/www/onyx \
                -u ${USER_ID}:${GROUP_ID} \
                ${QA_IMAGE_NAME} $1

qa-phar = $(call qa, $1 --exclude=vendor --exclude=node_modules --exclude=var/cache $2)

#------------------------------------------------------------------------------

reports:
	mkdir reports

create-qa-image:
	docker build -q --build-arg UID=${USER_ID} -t ${QA_IMAGE_NAME} docker/images/qa/

qa-loc: create-qa-image ## Run PHPLoc
	$(call qa-phar, phploc, --count-tests onyx)

qa-cpd: create-qa-image ## Run PHP Copy paste detector
	$(call qa-phar, phpcpd, onyx)

qa-dcd: create-qa-image ## Run PHP Dead code detector
	$(call qa-phar, phpdcd, onyx)

qa-md: create-qa-image ## Run PHP Mess detector
	$(call qa, phpmd onyx text codesize${COMMA}unusedcode${COMMA}naming${COMMA}cleancode${COMMA}design --exclude=vendor${COMMA}node_modules${COMMA}var/cache --suffixes php)

qa-depend: reports create-qa-image ## Run PHPDepend
	$(call qa, pdepend --suffix=php --ignore=vendor${COMMA}node_modules${COMMA}var/cache --summary-xml=onyx/reports/pdepend.xml --overview-pyramid=onyx/reports/pyramid.svg --jdepend-chart=onyx/reports/jdepend.svg onyx)

#------------------------------------------------------------------------------

clean-qa:
	-rm -rf reports/
	-docker rmi ${QA_IMAGE_NAME}

#------------------------------------------------------------------------------

.PHONY: create-qa-image qa qa-loc qa-cpd qa-dcd qa-md qa-depend
