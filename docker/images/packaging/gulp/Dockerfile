FROM node

ARG UID=1000

RUN npm install -g gulp && \
    useradd gulp --non-unique --uid ${UID} --home-dir /home/gulp

WORKDIR /home/gulp

RUN npm install --save-dev gulp gulp-sass gulp-csso gulp-csscomb gulp-cssbeautify gulp-autoprefixer gulp-rename

CMD ["/bin/bash"]
