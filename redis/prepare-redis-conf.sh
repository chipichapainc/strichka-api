#!/bin/sh

# prepare-redis-conf.sh
# Script to process redis.conf.template, replace placeholders with env vars, and remove comments

# Exit on errors
set -e

# Define paths
ENV_FILE="/.env"
TEMPLATE_FILE="/usr/local/etc/redis/redis.conf.template"
OUTPUT_FILE="/usr/local/etc/redis/redis.conf"

echo "Starting Redis configuration processing..."

# Check if template file exists
if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "ERROR: Template file $TEMPLATE_FILE not found!"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$(dirname "$OUTPUT_FILE")"

# Create a temporary file for processing
TMP_FILE=$(mktemp)

# First, copy the template file to the temporary file
cat "$TEMPLATE_FILE" > "$TMP_FILE"

# Check if env file exists
if [ -f "$ENV_FILE" ]; then
    echo "Processing environment variables from $ENV_FILE"
    
    # Read each line from the .env file
    while IFS= read -r line || [ -n "$line" ]; do
        # Skip empty lines and lines starting with #
        if [ -z "$line" ] || echo "$line" | grep -q "^#"; then
            continue
        fi
        
        # Extract variable name and value
        # Format expected: PARAM="value" or PARAM=value
        if echo "$line" | grep -q "="; then
            PARAM=$(echo "$line" | cut -d= -f1)
            VALUE=$(echo "$line" | cut -d= -f2- | sed 's/^"//;s/"$//')
            
            if [ -n "$PARAM" ] && [ -n "$VALUE" ]; then
                echo "Replacing {{$PARAM}} with $VALUE"
                # Replace {{PARAM}} with the value
                sed -i "s|{{$PARAM}}|$VALUE|g" "$TMP_FILE"
            fi
        fi
    done < "$ENV_FILE"
else
    echo "WARNING: Environment file $ENV_FILE not found. Using default values."
fi

# Remove comment lines (start with #)
echo "Removing comment lines..."
grep -v "^#" "$TMP_FILE" | grep -v "^$" > "$OUTPUT_FILE"

echo "Redis configuration has been processed and saved to $OUTPUT_FILE"

# Verify no unprocessed placeholders remain
if grep -q "{{.*}}" "$OUTPUT_FILE"; then
    echo "WARNING: Unprocessed placeholders found in the configuration file:"
    grep "{{.*}}" "$OUTPUT_FILE"
fi

echo "Configuration processing complete." 