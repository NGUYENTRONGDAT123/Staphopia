# Use a newest stable version of Node as a parent image
FROM node:erbium
# Install concurrently to start server and client together
RUN npm i -g concurrently

# SERVER
# Copy the current directory contents into the container at /api
COPY ./server/ /server/
# Set the working directory to /api
WORKDIR /server
# install dependencies
RUN npm i
# Make port 8393 available to the world outside this container
EXPOSE 8393

# CLIENT
# Copy the current directory contents into the container at /client
COPY ./react-client/ /client/
# Set the working directory to /client
WORKDIR /client
# install dependencies
RUN npm i
# Build the statis files
RUN npm run build
# change WORKDIR back to server
WORKDIR /server
# Run the app when the container launches
CMD [ "npm", "start" ]
