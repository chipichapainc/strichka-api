FROM redis:7.4.2-alpine

# Install sed (should already be in Alpine, but ensuring it's there)
RUN apk --no-cache add sed grep

# Create directories for our mounted volumes and configuration
RUN mkdir -p /usr/local/etc/redis

# Copy the configuration template and processing script
COPY redis.conf.template /usr/local/etc/redis/
COPY prepare-redis-conf.sh /usr/local/bin/
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/prepare-redis-conf.sh /usr/local/bin/entrypoint.sh

# This is a placeholder - the actual .env file will be mounted at runtime
# The script will check for this file's existence

# Use combined entrypoint script
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# No CMD needed as it's included in the entrypoint script
# Any additional args can be passed through to redis-server
