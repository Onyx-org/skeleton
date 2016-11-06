FROM node

ARG UID=1000

RUN npm install -g bower grunt-cli

RUN adduser bower --quiet --uid ${UID} --home /tmp/data --disabled-password
WORKDIR /home/bower

CMD ["/bin/bash"]
