FROM php:8.4-fpm

RUN apt-get update && apt-get install -y \
  libfreetype-dev \
  libjpeg62-turbo-dev \
  libpng-dev \
  && docker-php-ext-configure gd --with-freetype --with-jpeg \
  && docker-php-ext-install -j$(nproc) gd pdo_mysql \
  && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# php-fpm limpa o ambiente por padrao; sem isso getenv() nao enxerga as vars do compose
RUN printf '[www]\nclear_env = no\n' > /usr/local/etc/php-fpm.d/zzz-env.conf

RUN useradd -u 1000 -m developer

WORKDIR /var/www
USER developer

EXPOSE 9000

CMD ["php-fpm"]
