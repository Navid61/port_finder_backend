# Use Node.js as the base image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first for better layer caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all source files (except those in .dockerignore)
COPY . .

# Build the TypeScript files
RUN npm run build

# Expose the port for the backend server
EXPOSE 5000

# Run the `importPorts.ts` script and start the server
CMD ["sh", "-c", "node dist/importPorts.js && npm start"]
