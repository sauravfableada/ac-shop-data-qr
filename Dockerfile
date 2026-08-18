FROM php:8.2-apache

# Install system packages and PHP extensions required by Laravel
RUN apt-get update && \
    apt-get install -y unzip curl git zip libpng-dev libonig-dev libxml2-dev && \
    docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy project files
COPY . .

# Install PHP dependencies (production only, no dev)
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Set correct permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Expose Apache port
EXPOSE 80
