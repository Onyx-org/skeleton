FROM node

ARG UID=1000

RUN npm install -g gulp && \
    adduser gulp --quiet --uid ${UID} --home /home/gulp --disabled-password

WORKDIR /home/gulp

RUN npm install --save-dev gulp gulp-sass

CMD ["/bin/bash"]
