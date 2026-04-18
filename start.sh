#!/bin/bash

# Start the Python backend in the background
cd /app/backend && uvicorn main:app --host 0.0.0.0 --port 8000 &

# Start Caddy in the foreground
caddy run --config /app/Caddyfile
