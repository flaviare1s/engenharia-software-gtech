FROM php:8.4-fpm

RUN apt-get update && apt-get install -y \
  libfreetype-dev \
  libjpeg62-turbo-dev \
  libpng-dev \
  && docker-php-ext-configure gd --with-freetype --with-jpeg \
  && docker-php-ext-install -j$(nproc) gd \
  && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN useradd -u 1000 -m developer

WORKDIR /var/www
USER developer

EXPOSE 9000

CMD ["php-fpm"]
