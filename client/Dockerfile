# Use a newest stable version of Node as a parent image
FROM node:erbium
# Copy the current directory contents into the container at /client
COPY . /client/
# Set the working directory to /client
WORKDIR /client
# install dependencies
RUN npm i
# Make port 3000 available to the world outside this container
EXPOSE 3000
# Run the app when the container launches
CMD ["npm", "start"]
