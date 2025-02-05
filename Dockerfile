# Use the official Node.js image as base
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the entire project
COPY . .

# Copy .env.local file
COPY .env.local .env.local

# Build the application
RUN npm run build

# Use a minimal Node.js image for production
FROM node:20-alpine AS runner
WORKDIR /app

# Copy built application from builder
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/.env.local .env.local

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]