# Use a newest stable version of Node as a parent image
FROM node:erbium
# Copy the current directory contents into the container at /api
COPY . /server/
# Set the working directory to /api
WORKDIR /server
# install dependencies
RUN npm i
# Make port 8393 available to the world outside this container
EXPOSE 8393
# Run the app when the container launches
CMD ["npm", "start"]