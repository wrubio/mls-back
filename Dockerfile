# specify a base image
FROM node:12.12.0-alpine

WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app

EXPOSE 3200

CMD [ "npm", "run", "dev" ]