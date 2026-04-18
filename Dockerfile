# Stage 1: Build Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app
COPY package*.json ./
# Use --frozen-lockfile if possible, but for now just install
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production Environment
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies including Caddy
RUN apt-get update && apt-get install -y \
    curl \
    debian-keyring \
    debian-archive-keyring \
    apt-transport-https \
    && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | tee /usr/share/keyrings/caddy-stable-archive-keyring.gpg > /dev/null \
    && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list \
    && apt-get update \
    && apt-get install -y caddy \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Python backend dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend source code
COPY backend/ ./backend/

# Copy built frontend assets
COPY --from=frontend-builder /app/dist ./dist

# Copy configuration files
COPY Caddyfile ./Caddyfile
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Expose the standard HTTP port
EXPOSE 80

# Run the startup script
CMD ["./start.sh"]
