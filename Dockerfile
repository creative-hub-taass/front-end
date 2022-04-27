# choose base image to build off of
FROM node:latest

# set the current working directory for all commands
WORKDIR /usr/src/app

# copy these over first and run 'npm install' so the node_modules will be cached
# until the package.json / lock changes
COPY package.json .
COPY package-lock.json .
RUN npm install -g npm@8.8.0
RUN npm install @auth0/angular-jwt
RUN npm install --save @abacritt/angularx-social-login --legacy-peer-deps
# copy over all code files
COPY . .

# expose internal docker container port to external environment
EXPOSE 4200

# specify default command to run when we run the image
CMD /usr/src/app/node_modules/.bin/ng serve --host 0.0.0.0 --disable-host-check
