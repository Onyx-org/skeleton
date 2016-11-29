
COMMA=,

create-qa-image:
	docker build -q --build-arg UID=${USER_ID} -t onyx/qa docker/images/qa/

qa = docker run -t -i --rm \
  -v ${ONYX_DIR}:/var/www/onyx \
  -u ${USER_ID}:${GROUP_ID} \
	onyx/qa $1

qa-phar = $(call qa, $1 --exclude=vendor --exclude=bower_components --exclude=var/cache $2)

qa-loc: create-qa-image
	$(call qa-phar, phploc, --count-tests onyx)

qa-cpd: create-qa-image
		$(call qa-phar, phpcpd, onyx)

qa-dcd: create-qa-image
		$(call qa-phar, phpdcd, onyx)

qa-md: create-qa-image
		$(call qa, phpmd onyx text codesize${COMMA}unusedcode${COMMA}naming${COMMA}cleancode${COMMA}design --exclude=vendor${COMMA}bower_components${COMMA}var/cache --suffixes php)

qa-depend: create-qa-image
		$(call qa, pdepend --suffix=php --ignore=vendor${COMMA}bower_components${COMMA}var/cache --summary-xml=onyx/pdepend.xml --overview-pyramid=onyx/pyramid.svg --jdepend-chart=onyx/jdepend.svg onyx)
