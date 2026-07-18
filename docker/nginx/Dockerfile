# ==========================
# Stage 1 - Build React App
# ==========================

FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first (better Docker cache)
COPY frontend/frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source code
COPY frontend/frontend .

# Build production React application
RUN npm run build


# ==========================
# Stage 2 - Nginx
# ==========================

FROM nginxinc/nginx-unprivileged:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY docker/nginx/nginx.conf \
     /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx","-g","daemon off;"]