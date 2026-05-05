#!/bin/sh
set -e

cd /var/www/html

echo "[entrypoint] Waiting for database at ${DB_HOST}:${DB_PORT:-3306}..."
ATTEMPTS=0
until php -r "
try {
    new PDO(
        'mysql:host=' . getenv('DB_HOST') . ';port=' . (getenv('DB_PORT') ?: '3306'),
        getenv('DB_USERNAME'),
        getenv('DB_PASSWORD')
    );
    exit(0);
} catch (Throwable \$e) { exit(1); }
" 2>/dev/null; do
    ATTEMPTS=$((ATTEMPTS + 1))
    if [ "$ATTEMPTS" -gt 30 ]; then
        echo "[entrypoint] Database not reachable after 60s, aborting"
        exit 1
    fi
    sleep 2
done
echo "[entrypoint] Database ready"

chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

echo "[entrypoint] Running TastyIgniter migrations..."
php artisan igniter:up --force

php artisan storage:link 2>/dev/null || true

mkdir -p storage/app/public/media/uploads
chown -R www-data:www-data storage/app/public 2>/dev/null || true

php artisan igniter:theme-vendor-publish --force 2>/dev/null || true

php artisan config:cache 2>/dev/null || true
php artisan route:cache 2>/dev/null || true
php artisan view:cache 2>/dev/null || true

exec "$@"
