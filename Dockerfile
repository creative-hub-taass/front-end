
# choose base image to build off of
FROM node:alpine

# set the current working directory for all commands
WORKDIR /usr/src/app

# copy these over first and run 'npm install' so the node_modules will be cached
# until the package.json / lock changes
COPY package.json .
COPY package-lock.json .
RUN npm install
RUN npm install bootstrap --save
RUN npm install @auth0/angular-jwt
RUN npm install angularx-social-login --legacy-peer-deps
RUN npm install --save @angular-cool/social-login-buttons
# copy over all code files
COPY . .

# expose internal docker container port to external environment
EXPOSE 4200

# specify default command to run when we run the image
CMD /usr/src/app/node_modules/.bin/ng serve --host 0.0.0.0 --disable-host-check
