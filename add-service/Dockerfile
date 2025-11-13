# Multi-stage Dockerfile for the "add-service"
# Purpose:
# - Build a small production image for a Node 18 service that listens on port 3001.
# - Use a builder stage to install node_modules, then copy only what is needed into the final image
#   so the final image is smaller and doesn't include build artifacts or dev dependencies.
#
# Usage:
# - From repository root (or add-service directory), build the image:
#     docker build -t add-service:latest -f add-service/Dockerfile add-service
# - Run the container:
#     docker run -p 3001:3001 add-service:latest
# - The service exposes a /health endpoint used by the HEALTHCHECK instruction.

# --- Builder stage ---
FROM node:18-alpine AS builder
# Set working directory for build stage
WORKDIR /app

# Copy package descriptor files first to take advantage of Docker layer caching.
# This means subsequent builds that don't change package.json or package-lock.json
# will reuse the installed dependencies layer.
COPY package*.json ./

# Install production dependencies only (no devDependencies) using `npm ci`.
# npm ci produces reproducible installs from package-lock.json and is faster for CI/builds.
# Note: If you need devDependencies during build (e.g., to run a compile step), adjust this command.
RUN npm ci --only=production

# --- Final runtime image ---
FROM node:18-alpine
WORKDIR /app

# Copy only the installed node_modules from the builder stage into the runtime image.
# This avoids shipping build-time files and keeps the final image small.
COPY --from=builder /app/node_modules ./node_modules

# Copy the rest of the application source into the image.
# Be sure .dockerignore exists and excludes files you don't want in the image (node_modules, .git, local dev files, etc.)
COPY . .

# Expose the port the application listens on (used for documentation and some orchestration tools).
EXPOSE 3001

# HEALTHCHECK: Docker will periodically run this command to determine container health.
# - interval: how often to run the check (30s)
# - timeout: how long to wait for the check to complete (3s)
# - start-period: how long to wait after container start before starting checks (5s)
# - retries: number of consecutive failures before reporting unhealthy (3)
#
# The command issues an HTTP GET to the container's /health endpoint and throws an error
# (non-zero exit) if the response status is not 200. Adjust endpoint or logic if your service
# exposes health at a different path or requires auth.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error()})"

# Default command to run the service. Adjust to use a process manager or a different entrypoint
# if your app requires it (for example: `node --enable-source-maps server.js`).
CMD ["node", "server.js"]