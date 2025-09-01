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

# For security, do not copy the production environment variables file here
# Use the Docker Secrets functionality in the docker-compose.yml

# Build the production Vite application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

# Set the production environment
ENV NODE_ENV production

# Copy the output files from the build
COPY --from=builder /app/dist ./dist

# Install serve to serve the application
RUN npm install -g serve

# Expose the port on which the application will run
EXPOSE 5173

# Command to run the application
CMD ["serve", "-s", "dist", "-l", "5173"];