# Use a base image with Node.js
FROM node:18-alpine AS base

# Install necessary dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the production Vite application
RUN npm run build

# Production stage
FROM nginx:stable-alpine AS runner

# Copy the built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]