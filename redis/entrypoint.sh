#!/bin/sh

set -e

echo "Starting Redis entrypoint script..."

# Run the configuration preparation script
/usr/local/bin/prepare-redis-conf.sh

echo "Starting Redis server..."

exec redis-server /usr/local/etc/redis/redis.conf "$@" 