FROM php:7.0-cli

ARG UID=1000

RUN echo 'APT::Install-Recommends "0";' >>/etc/apt/apt.conf.d/99-recommends && \
    echo 'APT::Install-Suggests "0";' >>/etc/apt/apt.conf.d/99-suggests

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && \
    apt-get install -y wget libbz2-dev && \
    apt-get -y autoremove && \
    rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install bz2

RUN adduser qa --quiet --uid ${UID} --home /home/qa --disabled-password

WORKDIR /var/www

RUN wget https://phar.phpunit.de/phploc.phar && \
    chmod +x phploc.phar && \
    mv phploc.phar /usr/local/bin/phploc

RUN wget https://phar.phpunit.de/phpcpd.phar && \
    chmod +x phpcpd.phar && \
    mv phpcpd.phar /usr/local/bin/phpcpd

RUN wget https://phar.phpunit.de/phpdcd.phar && \
    chmod +x phpdcd.phar && \
    mv phpdcd.phar /usr/local/bin/phpdcd

RUN wget -c http://static.phpmd.org/php/latest/phpmd.phar && \
    chmod +x phpmd.phar && \
    mv phpmd.phar /usr/local/bin/phpmd

RUN wget http://static.pdepend.org/php/latest/pdepend.phar && \
    chmod +x pdepend.phar && \
    mv pdepend.phar /usr/local/bin/pdepend

COPY php.ini /usr/local/etc/php/conf.d

CMD ["/bin/bash"]
