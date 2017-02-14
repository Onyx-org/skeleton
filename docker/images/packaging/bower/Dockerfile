FROM node

ARG UID=1000

RUN npm install -g bower && \
    useradd bower --non-unique --uid ${UID} --home-dir /tmp/data

WORKDIR /home/bower

CMD ["/bin/bash"]
