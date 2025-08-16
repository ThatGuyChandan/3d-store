# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle app source
COPY . .

# Make port ${PORT} available to the world outside this container
# The actual port mapping is done in docker-compose.yml
EXPOSE 8080

# Define the command to run the app
CMD [ "npm", "start" ]
