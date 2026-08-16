# Use the official lightweight Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package config files first to leverage caching layers
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install packages across all workspaces
RUN npm install
RUN cd client && npm install
RUN cd server && npm install

# Copy the rest of the application files
COPY . .

# Build the React production client code
RUN npm run build

# Expose the default port (Hugging Face routes web traffic through port 7860)
EXPOSE 7860
ENV PORT=7860

# Start the Node.js native server
CMD ["npm", "run", "start"]
