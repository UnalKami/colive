#!/bin/bash

# Create SSL directory
mkdir -p ssl

# Generate private key
openssl genrsa -out ssl/server.key 2048

# Generate self-signed certificate
openssl req -new -x509 -key ssl/server.key -out ssl/server.crt -days 365 \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

echo "SSL certificates generated in ./ssl/"
echo "For production, use certificates from a trusted CA like Let's Encrypt"