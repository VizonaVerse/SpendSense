# Use an official Python image as base
FROM node:23-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the project files into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose the port Django runs on
EXPOSE 5000

# Run React server
CMD ["npm", "start"]