# Use an official Node runtime as a parent image
FROM node:latest

# Set the working directory to /app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY ./package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the current directory contents into the container at /app
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variable
ENV REACT_APP_API_URL=http://localhost:8080

# Run app when the container launches
CMD ["npm", "start"]
