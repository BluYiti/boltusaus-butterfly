# Use Node.js 18.17 image as the base
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package.json package-lock.json ./

# Install dependencies in development mode
ENV NODE_ENV=development
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the .env.local file into the container
COPY .env.local .env.local

# Ensure proper permissions
RUN chown -R node:node /app

# Expose the application port
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "dev"]
