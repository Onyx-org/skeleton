FROM php:7.1-apache

RUN echo 'APT::Install-Recommends "0";' >>/etc/apt/apt.conf.d/99-recommends && \
    echo 'APT::Install-Suggests "0";' >>/etc/apt/apt.conf.d/99-suggests

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && \
    apt-get install -y automake \
                       build-essential \
                       libtool && \
    apt-get -y autoremove && \
    rm -rf /var/lib/apt/lists/*

RUN pecl install xdebug && \
    docker-php-ext-enable xdebug && \
    docker-php-ext-install pdo_mysql

ADD bootstrap.sh /root/bootstrap.sh

ENTRYPOINT [ "sh", "/root/bootstrap.sh" ]

RUN a2enmod rewrite && \
    mkdir -p /var/www/onyx/var && \
    chown -Rf www-data:www-data /var/www/onyx && \
    rm -r /var/www/html && \
    ln -s /var/www/onyx/www /var/www/html

WORKDIR /var/www/onyx

COPY php.ini /usr/local/etc/php/conf.d

CMD ["apache2-foreground"]
