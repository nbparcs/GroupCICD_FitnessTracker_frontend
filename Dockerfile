# syntax=docker/dockerfile:1.4
FROM node:18-alpine AS build
WORKDIR /app

# Enable BuildKit cache mounts
RUN --mount=type=cache,target=/var/cache/npm \
    npm config set cache /var/cache/npm --global

# Copy only package files first for better layer caching
COPY fitness-tracker-app/package*.json ./

# Use npm ci with cache
RUN --mount=type=cache,target=/var/cache/npm \
    npm ci --no-audit --no-fund --prefer-offline

# Copy only necessary files for build
COPY fitness-tracker-app/public ./public
COPY fitness-tracker-app/src ./src

ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}

# Build with production settings
RUN npm run build -- --max-old-space-size=512

# ----- Serve stage -----
FROM nginx:alpine

# Pick which folder to copy; default to CRA's "build"
ARG BUILD_DIR=build
ENV BUILD_DIR=${BUILD_DIR}

# Copy the build output from the builder
COPY --from=build /app/build /usr/share/nginx/html

# Optional SPA routing (uncomment if you use React Router)
#COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]