# Use official Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Build the application for production
RUN npm run build

# Install static server
RUN npm install -g serve

# Run static server on port PORT (fallback to 5173 for local docker-compose)
CMD ["sh", "-c", "serve -s dist -l ${PORT:-5173}"]
