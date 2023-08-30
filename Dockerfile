FROM node:14.17.6-alpine

RUN apk update ; apk add sqlite

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./
COPY package-lock.json ./

#Install NPM packages
RUN npm ci --silent

# Bundle app source
COPY . .

EXPOSE 3001

CMD [ "/bin/sh", "-c", "npm run start-prod" ]