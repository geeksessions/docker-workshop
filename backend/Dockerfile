FROM mhart/alpine-node:8

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

# Bundle app source after installation to use docker build cache effectively
COPY ./sourcecode/ ./

# Run React app
CMD ["npm", "run", "start:dev"]
