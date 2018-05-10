FROM node:carbon
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
#RUN npm install
# Copy app source code
COPY . .
#Expose port and start application
EXPOSE 3003 27017
CMD [ "npm", "start" ]



# docker build : docker build -t ashish/blockcypher-node .
# docker run : docker run -P -p 3003:3003 --network="host" ashish/blockcypher-node