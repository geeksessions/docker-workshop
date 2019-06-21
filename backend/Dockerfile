FROM mhart/alpine-node:8

# Add curl tool required for the healthcheck CMD
RUN apk --no-cache add curl  

# Sets NODE_ENV as development so devDependencies are installed
ENV NODE_ENV=development

# Create and set the WORKDIR so all following commands run in it
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy the package.json and npm-shrinkwrap to fix dependencies versions
# NOTE: in order to use docker build cache properlly, add the less frequent updated files first
COPY ./sourcecode/package.json ./
COPY ./sourcecode/package-lock.json ./

# Install app dependencies
RUN npm install

## THE LIFE SAVER
### NOTE: make sure you check the bash script and make sure it's reliable (additionally, commit the script to your repo, so that will not change in time)
ADD https://raw.githubusercontent.com/eficode/wait-for/master/wait-for /wait-for
RUN chmod +x /wait-for

# Bundle app source after installation to use docker build cache effectively
COPY ./sourcecode/ ./

# Run script before command, wait-for mongodb to be available
# NOTE: doing this will force the container always to wait-for, alternatively use docker-compose.yml to overwrite the cmd
# CMD ["/wait-for", "mongodb:27017", "--", "npm", "run", "start:dev"]

# not required, but nice to have (to be explicit about the container required ports)
EXPOSE 3001

# Run React app
CMD ["npm", "run", "start:dev"]